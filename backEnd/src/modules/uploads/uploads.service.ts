import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { PrismaService } from '../../prisma/prisma.service';
import { MulterFile } from '../../common/types/multer';
import { StorageProvider } from '../../generated/prisma';

@Injectable()
export class UploadsService {
  private readonly bucket: string | null;
  private readonly publicBaseUrl: string | null;
  private readonly client: S3Client | null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const region = this.configService.get<string>('S3_REGION');
    const bucket = this.configService.get<string>('S3_BUCKET');
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'S3_SECRET_ACCESS_KEY',
    );

    if (!region || !bucket || !accessKeyId || !secretAccessKey) {
      this.bucket = null;
      this.publicBaseUrl = null;
      this.client = null;
    } else {
      this.bucket = bucket;
      this.publicBaseUrl =
        this.configService.get<string>('S3_PUBLIC_URL_BASE') ??
        `${endpoint ?? `https://s3.${region}.amazonaws.com`}/${bucket}`;
      this.client = new S3Client({
        region,
        endpoint,
        forcePathStyle: !!endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  async upload(file: MulterFile, createdById: string) {
    this.ensureConfigured();
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const timestamp = Date.now();
    const storageKey = `uploads/${createdById}/${timestamp}-${file.originalname}`;
    await this.client!.send(
      new PutObjectCommand({
        Bucket: this.bucket!,
        Key: storageKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const asset = await this.prisma.uploadAsset.create({
      data: {
        filename: storageKey.split('/').pop() ?? file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageKey,
        url: `${this.publicBaseUrl!.replace(/\/$/, '')}/${storageKey}`,
        bucket: this.bucket!,
        provider: StorageProvider.S3,
        createdBy: {
          connect: {
            id: createdById,
          },
        },
      },
    });

    return {
      ...asset,
      createdAt: asset.createdAt.toISOString(),
    };
  }

  async findOne(id: string) {
    const asset = await this.prisma.uploadAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Upload ${id} not found`);
    }

    return {
      ...asset,
      createdAt: asset.createdAt.toISOString(),
    };
  }

  async remove(id: string) {
    this.ensureConfigured();
    const asset = await this.prisma.uploadAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Upload ${id} not found`);
    }

    await this.client!.send(
      new DeleteObjectCommand({
        Bucket: asset.bucket,
        Key: asset.storageKey,
      }),
    );
    await this.prisma.uploadAsset.delete({ where: { id } });
    return { message: 'Upload deleted successfully' };
  }

  private ensureConfigured() {
    if (!this.client || !this.bucket || !this.publicBaseUrl) {
      throw new BadRequestException('S3 storage configuration is incomplete');
    }
  }
}
