import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TagEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  color?: string | null;

  @ApiProperty()
  postCount: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
