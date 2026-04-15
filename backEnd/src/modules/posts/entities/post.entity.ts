import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostCategoryEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class PostTagEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class PostEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  excerpt?: string | null;

  @ApiPropertyOptional()
  coverImage?: string | null;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  featured: boolean;

  @ApiProperty()
  views: number;

  @ApiPropertyOptional()
  readingTime?: number | null;

  @ApiPropertyOptional()
  publishedAt?: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiPropertyOptional({ type: PostCategoryEntity })
  category?: PostCategoryEntity | null;

  @ApiProperty({ type: [PostTagEntity] })
  tags: PostTagEntity[];
}
