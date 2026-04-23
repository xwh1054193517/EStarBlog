import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { UploadsService } from './uploads.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { InitMultipartUploadDto } from './dto/init-multipart-upload.dto';
import { CompleteMultipartUploadDto } from './dto/complete-multipart-upload.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { getCurrentUserDec } from '../../common/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('file')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('upload')
  @ApiOperation({ summary: '小文件直传（适合 <= 20MB）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  )
  async uploadSmallFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('prefix') prefix?: string,
    @getCurrentUserDec() user?: AccessTokenPayload,
  ) {
    return this.uploadsService.uploadSmallFile(file, prefix, user?.sub);
  }

  @Post('multipart/init')
  @ApiOperation({ summary: '初始化大文件分片上传' })
  async initMultipartUpload(@Body() dto: InitMultipartUploadDto) {
    return this.uploadsService.initMultipartUpload(dto);
  }

  @Post('multipart/:uploadId/:partNumber')
  @ApiOperation({ summary: '上传单个分片' })
  @ApiParam({ name: 'uploadId', description: 'multipart upload id' })
  @ApiParam({ name: 'partNumber', description: '分片编号，从 1 开始' })
  @ApiQuery({ name: 'objectName', required: true, description: '对象名' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    }),
  )
  async uploadPart(
    @Param('uploadId') uploadId: string,
    @Param('partNumber', ParseIntPipe) partNumber: number,
    @Query('objectName') objectName: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadsService.uploadPart({
      objectName,
      uploadId,
      partNumber,
      file,
    });
  }

  @Get('multipart/:uploadId/parts')
  @ApiOperation({ summary: '查询已上传分片，支持断点续传' })
  @ApiParam({ name: 'uploadId' })
  @ApiQuery({ name: 'objectName', required: true })
  async listUploadedParts(
    @Param('uploadId') uploadId: string,
    @Query('objectName') objectName: string,
  ) {
    return this.uploadsService.listUploadedParts(objectName, uploadId);
  }

  @Post('multipart/complete')
  @ApiOperation({ summary: '合并分片，完成上传' })
  @UseGuards(JwtAuthGuard)
  async completeMultipartUpload(
    @Body() dto: CompleteMultipartUploadDto,
    @getCurrentUserDec() user?: AccessTokenPayload,
  ) {
    return this.uploadsService.completeMultipartUpload(dto, user?.sub);
  }

  @Delete('multipart/:uploadId')
  @ApiOperation({ summary: '取消 multipart 上传' })
  @ApiParam({ name: 'uploadId' })
  @ApiQuery({ name: 'objectName', required: true })
  @UseGuards(JwtAuthGuard)
  async abortMultipartUpload(
    @Param('uploadId') uploadId: string,
    @Query('objectName') objectName: string,
  ) {
    return this.uploadsService.abortMultipartUpload(objectName, uploadId);
  }

  @Get('my-assets')
  @ApiOperation({ summary: '获取当前用户的文件列表' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @UseGuards(JwtAuthGuard)
  async getMyAssets(
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 20,
    @getCurrentUserDec() user?: AccessTokenPayload,
  ) {
    return this.uploadsService.getUserAssets(user.sub, page, pageSize);
  }

  @Get(':objectName/presigned-url')
  @ApiOperation({ summary: '获取下载签名链接' })
  @ApiQuery({ name: 'expiresIn', required: false, example: 3600 })
  async getPresignedUrl(
    @Param('objectName') objectName: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    return {
      objectName,
      url: await this.uploadsService.getPresignedDownloadUrl(
        objectName,
        expiresIn ? Number(expiresIn) : 3600,
      ),
    };
  }

  @Get(':objectName/download')
  @ApiOperation({ summary: '下载文件流' })
  async downloadFile(
    @Param('objectName') objectName: string,
    @Res() res: Response,
  ) {
    const file = await this.uploadsService.getFileStream(objectName);

    res.setHeader('Content-Type', file.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(objectName)}"`,
    );

    file.stream.pipe(res);
  }

  @Delete()
  @ApiOperation({ summary: '删除文件' })
  @ApiQuery({ name: 'objectName', required: true })
  @UseGuards(JwtAuthGuard)
  async removeFileByQuery(@Query('objectName') objectName: string) {
    return this.uploadsService.removeFile(objectName);
  }

  @Delete(':objectName')
  @ApiOperation({ summary: '删除文件' })
  @UseGuards(JwtAuthGuard)
  async removeFile(@Param('objectName') objectName: string) {
    return this.uploadsService.removeFile(objectName);
  }
}
