import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UploadedPartDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  partNumber: number;

  @ApiProperty({ example: '"d41d8cd98f00b204e9800998ecf8427e"' })
  @IsString()
  @IsNotEmpty()
  etag: string;
}

export class CompleteMultipartUploadDto {
  @ApiProperty({ example: 'uploads/1713600000-abcd-avatar.png' })
  @IsString()
  @IsNotEmpty()
  objectName: string;

  @ApiProperty({ example: 'VXBsb2FkIElE...' })
  @IsString()
  @IsNotEmpty()
  uploadId: string;

  @ApiProperty({ example: 'avatar.png', required: false })
  @IsString()
  fileName?: string;

  @ApiProperty({ example: 'image/png', required: false })
  @IsString()
  contentType?: string;

  @ApiProperty({
    type: [UploadedPartDto],
    description: '客户端已成功上传的分片清单',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UploadedPartDto)
  parts: UploadedPartDto[];
}
