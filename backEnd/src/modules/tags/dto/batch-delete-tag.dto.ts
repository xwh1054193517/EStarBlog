import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class BatchDeleteTagDto {
  @ApiProperty({ description: 'Array of tag IDs to delete', type: [String] })
  @IsArray()
  @IsOptional()
  ids?: string[];
}
