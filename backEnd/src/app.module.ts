import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RolesGuard } from './common/guards/roles.guard';
import { HealthController } from './health.controller';
import { PostsModule } from './modules/posts/posts.module';
import { PresenceModule } from './modules/presence/presence.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { StatsModule } from './modules/stats/stats.module';
import { TagsModule } from './modules/tags/tags.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SiteConfigModule } from './modules/site-config/site-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    AuthModule,
    PostsModule,
    CategoriesModule,
    TagsModule,
    PresenceModule,
    StatsModule,
    UploadsModule,
    ProfileModule,
    SiteConfigModule,
  ],
  controllers: [HealthController],
  providers: [RolesGuard],
})
export class AppModule {}
