import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Role, User } from '../../generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';
import { AuthSessionEntity } from './entities/auth-session.entity';
import { AuthUserEntity } from './entities/auth-user.entity';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './interfaces/jwt-payload.interface';

type SessionRecord = {
  userId: string;
  refreshId: string;
  role: Role;
};

@Injectable()
export class AuthService {
  private readonly accessTokenTtlSeconds: number;
  private readonly refreshTokenTtlSeconds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenTtlSeconds = Number(
      this.configService.get<string>('JWT_ACCESS_TOKEN_TTL_SECONDS') ?? 900,
    );
    this.refreshTokenTtlSeconds = Number(
      this.configService.get<string>('JWT_REFRESH_TOKEN_TTL_SECONDS') ??
        60 * 60 * 24 * 7,
    );
  }

  async createSession(dto: CreateSessionDto): Promise<AuthSessionEntity> {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const matched = await bcrypt.compare(dto.password, user.password);
    if (!matched) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admin users can access this backend');
    }

    return this.issueSession(user);
  }

  async refreshSession(dto: RefreshSessionDto): Promise<AuthSessionEntity> {
    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        dto.refreshToken,
        {
          secret: this.getJwtSecret(),
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.getSession(payload.sessionId);
    if (
      !session ||
      session.userId !== payload.sub ||
      session.refreshId !== payload.refreshId
    ) {
      throw new UnauthorizedException('Refresh session is invalid');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.issueSession(user, payload.sessionId);
  }

  async deleteSession(user: AccessTokenPayload) {
    await this.redisService.del(this.getSessionKey(user.sessionId));
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(user: AccessTokenPayload): Promise<AuthUserEntity> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (!currentUser) {
      throw new UnauthorizedException('User not found');
    }

    return this.toAuthUser(currentUser);
  }

  // 签发jwtToken
  private async issueSession(
    user: User,
    sessionId: string = randomUUID(),
  ): Promise<AuthSessionEntity> {
    const refreshId = randomUUID();
    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      sessionId,
      type: 'access',
    };
    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      sessionId,
      refreshId,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.getJwtSecret(),
        expiresIn: this.accessTokenTtlSeconds,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.getJwtSecret(),
        expiresIn: this.refreshTokenTtlSeconds,
      }),
    ]);

    const session: SessionRecord = {
      userId: user.id,
      refreshId,
      role: user.role,
    };
    await this.redisService.set(
      this.getSessionKey(sessionId),
      JSON.stringify(session),
      this.refreshTokenTtlSeconds,
    );

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.accessTokenTtlSeconds,
      user: this.toAuthUser(user),
    };
  }

  private async getSession(sessionId: string): Promise<SessionRecord | null> {
    const session = await this.redisService.get(this.getSessionKey(sessionId));
    return session ? (JSON.parse(session) as SessionRecord) : null;
  }

  private getSessionKey(sessionId: string) {
    return `auth:session:${sessionId}`;
  }

  private getJwtSecret() {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new UnauthorizedException('JWT secret is not configured');
    }
    return secret;
  }

  private toAuthUser(user: User): AuthUserEntity {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
