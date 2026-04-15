import { ApiProperty } from '@nestjs/swagger';
import { StorageProvider } from '../../../generated/prisma';

export class UploadFileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  storageKey: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  bucket: string;

  @ApiProperty({ enum: StorageProvider })
  provider: StorageProvider;

  @ApiProperty()
  createdAt: string;
}
