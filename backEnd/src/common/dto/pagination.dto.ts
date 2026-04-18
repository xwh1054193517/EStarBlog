import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}

export class SearchQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page: number = 1;

  @ApiPropertyOptional({ description: 'Page size', default: 10 })
  pageSize: number = 10;

  @ApiPropertyOptional({ description: 'Total items', default: 0 })
  total: number = 0;

  @ApiPropertyOptional({ description: 'Total pages', default: 0 })
  totalPages: number = 0;
}
