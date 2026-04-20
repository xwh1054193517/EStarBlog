import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FileQueryDto {
  @ApiPropertyOptional({ example: 'blog/' })
  @IsOptional()
  @IsString()
  prefix?: string;
}
