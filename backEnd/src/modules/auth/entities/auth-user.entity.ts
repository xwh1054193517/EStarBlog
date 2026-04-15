import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../generated/prisma';

export class AuthUserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ enum: Role })
  role: Role;
}
