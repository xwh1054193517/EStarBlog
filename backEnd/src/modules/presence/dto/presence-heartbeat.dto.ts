import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class PresenceHeartbeatDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  visitorId: string;
}
