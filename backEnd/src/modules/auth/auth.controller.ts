import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { getCurrentUserDec } from '../../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';
import { AuthSessionEntity } from './entities/auth-session.entity';
import { AuthUserEntity } from './entities/auth-user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AccessTokenPayload } from './interfaces/jwt-payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Create admin session' })
  @ApiOkResponse({ type: AuthSessionEntity })
  createSession(@Body() dto: CreateSessionDto) {
    return this.authService.createSession(dto);
  }

  @Post('sessions/refresh')
  @ApiOperation({ summary: 'Refresh admin session' })
  @ApiOkResponse({ type: AuthSessionEntity })
  refreshSession(@Body() dto: RefreshSessionDto) {
    return this.authService.refreshSession(dto);
  }

  @Delete('sessions/current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current admin session' })
  deleteSession(@getCurrentUserDec() user: AccessTokenPayload) {
    return this.authService.deleteSession(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin user' })
  @ApiOkResponse({ type: AuthUserEntity })
  getMe(@getCurrentUserDec() user: AccessTokenPayload) {
    return this.authService.getCurrentUser(user);
  }
}
