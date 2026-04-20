import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class InitMultipartUploadDto {
  @ApiProperty({ example: 'avatar.png', description: '原始文件名' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'image/png', description: '文件 MIME 类型' })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({ example: 10485760, description: '文件总大小，单位字节' })
  @IsInt()
  @Min(1)
  size: number;

  @ApiPropertyOptional({
    example: 'images/',
    description: '对象前缀目录，例如 images/ docs/',
  })
  @IsOptional()
  @IsString()
  prefix?: string;

  @ApiPropertyOptional({
    example: 5242880,
    description: '每个分片大小，默认 5MB，最小建议 5MB',
  })
  @IsOptional()
  @IsInt()
  @Min(5 * 1024 * 1024)
  @Max(100 * 1024 * 1024)
  partSize?: number;
}
