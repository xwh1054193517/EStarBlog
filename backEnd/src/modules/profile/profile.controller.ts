import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { getCurrentUserDec } from '../../common/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import type { AccessTokenPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: ProfileEntity })
  getProfile(@getCurrentUserDec() user: AccessTokenPayload) {
    return this.profileService.findByUserId(user.sub);
  }

  @Patch()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ type: ProfileEntity })
  updateProfile(
    @getCurrentUserDec() user: AccessTokenPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.update(user.sub, dto);
  }

  @Patch('info')
  @ApiOperation({ summary: 'Update profile info' })
  @ApiOkResponse({ type: ProfileEntity })
  updateProfileInfo(
    @getCurrentUserDec() user: AccessTokenPayload,
    @Body()
    data: Partial<{
      displayName: string;
      bio: string;
      avatar: string;
      email: string;
      phone: string;
      wechat: string;
      qq: string;
      github: string;
      twitter: string;
      weibo: string;
      bilibili: string;
      youtube: string;
      location: string;
      company: string;
      position: string;
    }>,
  ) {
    return this.profileService.updateProfileInfo(user.sub, data);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete current user profile' })
  deleteProfile(@getCurrentUserDec() user: AccessTokenPayload) {
    return this.profileService.delete(user.sub);
  }
}
