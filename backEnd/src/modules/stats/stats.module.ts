import { Module } from '@nestjs/common';
import { PresenceModule } from '../presence/presence.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [PresenceModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
