import { ApiProperty } from '@nestjs/swagger';
import { AuthUserEntity } from './auth-user.entity';

export class AuthSessionEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ default: 'Bearer' })
  tokenType: string;

  @ApiProperty()
  expiresIn: number;

  @ApiProperty({ type: AuthUserEntity })
  user: AuthUserEntity;
}
