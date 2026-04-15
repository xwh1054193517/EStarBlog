import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AccessTokenPayload } from '../auth/interfaces/jwt-payload.interface';
import { getCurrentUserDec } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../generated/prisma';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload file to object storage' })
  @ApiOkResponse({ type: UploadFileResponseDto })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @getCurrentUserDec() user: AccessTokenPayload,
  ) {
    return this.uploadsService.upload(file, user.sub);
  }

  @Get(':id')
  @ApiOkResponse({ type: UploadFileResponseDto })
  findOne(@Param('id') id: string) {
    return this.uploadsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadsService.remove(id);
  }
}
