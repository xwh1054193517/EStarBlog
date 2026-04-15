import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../generated/prisma';
import { DashboardStatsEntity } from './entities/dashboard-stats.entity';
import { SiteStatsEntity } from './entities/site-stats.entity';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('stats/site')
  @ApiOperation({ summary: 'Get public site stats' })
  @ApiOkResponse({ type: SiteStatsEntity })
  getSiteStats() {
    return this.statsService.getSiteStats();
  }

  @Get('admin/stats/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  @ApiOkResponse({ type: DashboardStatsEntity })
  getDashboardStats() {
    return this.statsService.getDashboardStats();
  }
}
