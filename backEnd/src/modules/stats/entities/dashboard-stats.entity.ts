import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsEntity {
  @ApiProperty()
  postCount: number;

  @ApiProperty()
  publishedPostCount: number;

  @ApiProperty()
  draftPostCount: number;

  @ApiProperty()
  categoryCount: number;

  @ApiProperty()
  tagCount: number;

  @ApiProperty()
  onlineUsers: number;
}
