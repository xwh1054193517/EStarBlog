import { Body, Controller, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PresenceHeartbeatDto } from './dto/presence-heartbeat.dto';
import { PresenceService } from './presence.service';

@ApiTags('Presence')
@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Put('current')
  @ApiOperation({ summary: 'Heartbeat current visitor presence' })
  heartbeat(@Body() dto: PresenceHeartbeatDto) {
    return this.presenceService.heartbeat(dto.visitorId);
  }
}
