import { ApiProperty } from '@nestjs/swagger';

export class SiteStatsEntity {
  @ApiProperty()
  postCount: number;

  @ApiProperty()
  categoryCount: number;

  @ApiProperty()
  tagCount: number;

  @ApiProperty()
  onlineUsers: number;
}
