import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class BatchDeleteCategoryDto {
  @ApiProperty({ description: 'Array of category IDs to delete', type: [String] })
  @IsArray()
  @IsOptional()
  ids?: string[];
}
