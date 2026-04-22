import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateBucketCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  ListPartsCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { InitMultipartUploadDto } from './dto/init-multipart-upload.dto';
import { CompleteMultipartUploadDto } from './dto/complete-multipart-upload.dto';
import { Readable } from 'stream';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageProvider } from '../../generated/prisma';

@Injectable()
export class UploadsService implements OnModuleInit {
  private readonly s3: S3Client;
  private readonly bucket: string;

  private readonly allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ]);

  private readonly publicUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const endpoint = this.configService.get<string>(
      'MINIO_ENDPOINT',
      '127.0.0.1',
    );
    const port = this.configService.get<string>('MINIO_PORT', '9000');
    const useSSL =
      this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const protocol = useSSL ? 'https' : 'http';

    this.bucket = this.configService.get<string>('MINIO_BUCKET', 'app-files');

    this.publicUrl =
      this.configService
        .get<string>('MINIO_PUBLIC_BASE_URL', '')
        .replace(/\/+$/, '') ||
      this.configService.get<string>('MINIO_PUBLIC_URL', '').replace(/\/+$/, '') ||
      `${protocol}://${endpoint}:${port}/${this.bucket}`;

    this.s3 = new S3Client({
      region: this.configService.get<string>('MINIO_REGION', 'us-east-1'),
      endpoint: `${protocol}://${endpoint}:${port}`,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get<string>('MINIO_ACCESS_KEY', ''),
        secretAccessKey: this.configService.get<string>('MINIO_SECRET_KEY', ''),
      },
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.s3.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  private validateMimeType(contentType: string) {
    if (!this.allowedMimeTypes.has(contentType)) {
      throw new BadRequestException(`不支持的文件类型: ${contentType}`);
    }
  }

  private stripEtag(etag?: string) {
    return etag?.replace(/^"+|"+$/g, '') || '';
  }

  private normalizeObjectName(fileName: string, prefix?: string) {
    const safePrefix = prefix ? prefix.replace(/^\/+|\/+$/g, '') + '/' : '';
    const ext = fileName.includes('.')
      ? fileName.slice(fileName.lastIndexOf('.'))
      : '';
    const base = fileName
      .replace(ext, '')
      .replace(/[^\w\u4e00-\u9fa5-]/g, '_')
      .slice(0, 80);

    return `${safePrefix}${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`;
  }

  private buildPublicFileUrl(objectName: string) {
    return `${this.publicUrl}/${objectName.replace(/^\/+/, '')}`;
  }

  private normalizeAssetUrl(storageKey: string, currentUrl?: string | null) {
    if (!storageKey) return currentUrl || '';
    return this.buildPublicFileUrl(storageKey);
  }

  async getPresignedDownloadUrl(objectName: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: objectName,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }
  // 上传小文件
  // 支持的文件类型：image/jpeg, image/png, image/webp, image/gif, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain
  async uploadSmallFile(
    file: Express.Multer.File,
    prefix?: string,
    createdById?: string,
  ) {
    if (!file) {
      throw new BadRequestException('文件不能为空');
    }
    this.validateMimeType(file.mimetype);

    const objectName = this.normalizeObjectName(file.originalname, prefix);

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: objectName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );

    const previewUrl = await this.getPresignedDownloadUrl(objectName, 3600);
    const url = this.buildPublicFileUrl(objectName);

    if (createdById) {
      await this.prisma.uploadAsset.create({
        data: {
          filename: objectName,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          storageKey: objectName,
          url,
          bucket: this.bucket,
          provider: StorageProvider.S3,
          createdById,
        },
      });
    }

    return {
      bucket: this.bucket,
      objectName,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      previewUrl,
    };
  }

  // 初始化分片上传
  async initMultipartUpload(dto: InitMultipartUploadDto) {
    this.validateMimeType(dto.contentType);

    const partSize = dto.partSize || 5 * 1024 * 1024;
    const totalParts = Math.ceil(dto.size / partSize);

    if (totalParts > 10000) {
      throw new BadRequestException('分片数量不能超过 10000，请增大 partSize');
    }

    const objectName = this.normalizeObjectName(dto.fileName, dto.prefix);

    const result = await this.s3.send(
      new CreateMultipartUploadCommand({
        Bucket: this.bucket,
        Key: objectName,
        ContentType: dto.contentType,
      }),
    );

    return {
      bucket: this.bucket,
      objectName,
      uploadId: result.UploadId,
      partSize,
      totalParts,
      fileName: dto.fileName,
      contentType: dto.contentType,
      size: dto.size,
    };
  }

  // 上传分片
  // 支持的文件类型：image/jpeg, image/png, image/webp, image/gif, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain
  async uploadPart(params: {
    objectName: string;
    uploadId: string;
    partNumber: number;
    file: Express.Multer.File;
  }) {
    const { objectName, uploadId, partNumber, file } = params;

    if (!file) {
      throw new BadRequestException('分片文件不能为空');
    }

    if (!uploadId || !objectName) {
      throw new BadRequestException('uploadId 和 objectName 不能为空');
    }

    if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > 10000) {
      throw new BadRequestException('partNumber 必须在 1 到 10000 之间');
    }

    const result = await this.s3.send(
      new UploadPartCommand({
        Bucket: this.bucket,
        Key: objectName,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: file.buffer,
        ContentLength: file.size,
      }),
    );

    return {
      objectName,
      uploadId,
      partNumber,
      etag: result.ETag,
    };
  }

  // 列出已上传的分片
  async listUploadedParts(objectName: string, uploadId: string) {
    const result = await this.s3.send(
      new ListPartsCommand({
        Bucket: this.bucket,
        Key: objectName,
        UploadId: uploadId,
      }),
    );

    return {
      objectName,
      uploadId,
      parts:
        result.Parts?.map((p) => ({
          partNumber: p.PartNumber,
          etag: p.ETag,
          size: p.Size,
          lastModified: p.LastModified,
        })) || [],
    };
  }

  // 完成分片上传
  async completeMultipartUpload(
    dto: CompleteMultipartUploadDto,
    createdById?: string,
  ) {
    const sortedParts = [...dto.parts]
      .sort((a, b) => a.partNumber - b.partNumber)
      .map((p) => ({
        PartNumber: p.partNumber,
        ETag: p.etag,
      }));

    await this.s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.bucket,
        Key: dto.objectName,
        UploadId: dto.uploadId,
        MultipartUpload: {
          Parts: sortedParts,
        },
      }),
    );

    const stat = await this.statFile(dto.objectName);
    const previewUrl = await this.getPresignedDownloadUrl(dto.objectName, 3600);
    const url = this.buildPublicFileUrl(dto.objectName);

    if (createdById) {
      await this.prisma.uploadAsset.create({
        data: {
          filename: dto.objectName,
          originalName: dto.fileName || dto.objectName,
          mimeType: dto.contentType || stat.contentType,
          size: stat.size,
          storageKey: dto.objectName,
          url,
          bucket: this.bucket,
          provider: StorageProvider.S3,
          createdById,
        },
      });
    }

    return {
      success: true,
      objectName: dto.objectName,
      size: stat.size,
      mimeType: stat.contentType,
      previewUrl,
    };
  }

  // 中止分片上传
  async abortMultipartUpload(objectName: string, uploadId: string) {
    await this.s3.send(
      new AbortMultipartUploadCommand({
        Bucket: this.bucket,
        Key: objectName,
        UploadId: uploadId,
      }),
    );

    return {
      success: true,
      objectName,
      uploadId,
    };
  }

  // 获取文件元数据
  async statFile(objectName: string) {
    try {
      const result = await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: objectName,
        }),
      );

      return {
        objectName,
        size: result.ContentLength || 0,
        contentType: result.ContentType || 'application/octet-stream',
        lastModified: result.LastModified,
        etag: result.ETag,
      };
    } catch {
      throw new NotFoundException('文件不存在');
    }
  }

  // 列出文件
  async listFiles(prefix = '') {
    const result = await this.s3.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
      }),
    );

    return (result.Contents || []).map((item) => ({
      objectName: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      etag: item.ETag,
    }));
  }

  // 删除文件
  async removeFile(objectName: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: objectName,
      }),
    );

    await this.prisma.uploadAsset.deleteMany({
      where: { storageKey: objectName },
    });

    return {
      success: true,
      objectName,
    };
  }

  async getUserAssets(userId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;

    const [assets, total] = await Promise.all([
      this.prisma.uploadAsset.findMany({
        where: { createdById: userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.uploadAsset.count({
        where: { createdById: userId },
      }),
    ]);

    return {
      data: assets.map((asset) => ({
        ...asset,
        url: this.normalizeAssetUrl(asset.storageKey, asset.url),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getAssetByObjectName(objectName: string) {
    return this.prisma.uploadAsset.findUnique({
      where: { storageKey: objectName },
    });
  }

  // 获取文件流
  async getFileStream(objectName: string): Promise<{
    stream: Readable;
    contentType: string;
    size: number;
  }> {
    const result = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: objectName,
      }),
    );

    if (!result.Body) {
      throw new NotFoundException('文件不存在');
    }

    return {
      stream: result.Body as Readable,
      contentType: result.ContentType || 'application/octet-stream',
      size: Number(result.ContentLength || 0),
    };
  }

  // 验证分片是否上传成功
  async verifyPartsFromServer(objectName: string, uploadId: string) {
    const remote = await this.listUploadedParts(objectName, uploadId);

    return remote.parts.map((p) => ({
      partNumber: p.partNumber,
      etag: this.stripEtag(p.etag),
      size: p.size,
    }));
  }
}
