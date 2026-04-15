import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from '../../generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';
// 这是自动注册管理员账号
@Injectable()
export class AuthBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(AuthBootstrapService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      const username = this.configService.get<string>('ADMIN_USERNAME');
      const password = this.configService.get<string>('ADMIN_PASSWORD');

      if (!username || !password) {
        this.logger.warn(
          'Admin bootstrap skipped because ADMIN_USERNAME or ADMIN_PASSWORD is missing',
        );
        return;
      }

      const existing = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existing) {
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          username,
          password: passwordHash,
          role: Role.ADMIN,
        },
      });

      this.logger.log(`Bootstrap admin user created: ${username}`);
    } catch (error) {
      this.logger.warn(
        `Admin bootstrap skipped because schema is not ready: ${String(error)}`,
      );
    }
  }
}
