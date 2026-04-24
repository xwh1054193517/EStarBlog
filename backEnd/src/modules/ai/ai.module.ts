import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { KimiClient } from './clients/kimi.client';
import { AI_CLIENT } from './interfaces/ai-client.interface';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [AiController],
  providers: [
    AiService,
    KimiClient,
    {
      provide: AI_CLIENT,
      useExisting: KimiClient,
    },
  ],
  exports: [AiService, AI_CLIENT, KimiClient],
})
export class AiModule {}
