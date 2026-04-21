import { Injectable } from '@nestjs/common';
import { PresenceService } from '../presence/presence.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

const STATS_KEYS = {
  TOTAL_VISITORS: 'stats:total_visitors',
  TOTAL_PAGE_VIEWS: 'stats:total_page_views',
};

@Injectable()
export class StatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly presenceService: PresenceService,
    private readonly redisService: RedisService,
  ) {}

  async trackView(visitorId: string, path?: string) {
    const [totalVisitors, totalPageViews] = await Promise.all([
      this.redisService.pfadd(STATS_KEYS.TOTAL_VISITORS, visitorId),
      this.redisService.incrby(STATS_KEYS.TOTAL_PAGE_VIEWS, 1),
      this.presenceService.heartbeat(visitorId),
    ]);
    return { totalVisitors, totalPageViews };
  }

  async getSiteStats() {
    const [postCount, categoryCount, tagCount, onlineUsers, totalVisitors, totalPageViews] =
      await Promise.all([
        this.prisma.post.count({ where: { published: true } }),
        this.prisma.category.count(),
        this.prisma.tag.count(),
        this.presenceService.getOnlineUsers(),
        this.getTotalVisitors(),
        this.getTotalPageViews(),
      ]);

    const totalWords = await this.getTotalWords();

    return {
      postCount,
      categoryCount,
      tagCount,
      onlineUsers,
      totalVisitors,
      totalPageViews,
      totalWords,
    };
  }

  async getDashboardStats() {
    const [
      postCount,
      publishedPostCount,
      draftPostCount,
      categoryCount,
      tagCount,
      onlineUsers,
      totalVisitors,
      totalPageViews,
    ] = await Promise.all([
      this.prisma.post.count(),
      this.prisma.post.count({ where: { published: true } }),
      this.prisma.post.count({ where: { published: false } }),
      this.prisma.category.count(),
      this.prisma.tag.count(),
      this.presenceService.getOnlineUsers(),
      this.getTotalVisitors(),
      this.getTotalPageViews(),
    ]);

    const totalWords = await this.getTotalWords();

    return {
      postCount,
      publishedPostCount,
      draftPostCount,
      categoryCount,
      tagCount,
      onlineUsers,
      totalVisitors,
      totalPageViews,
      totalWords,
    };
  }

  private async getTotalVisitors(): Promise<number> {
    return this.redisService.pfcount(STATS_KEYS.TOTAL_VISITORS);
  }

  private async getTotalPageViews(): Promise<number> {
    const views = await this.redisService.get(STATS_KEYS.TOTAL_PAGE_VIEWS);
    return Number(views) || 0;
  }

  private async getTotalWords(): Promise<number> {
    const result = await this.prisma.post.aggregate({
      where: { published: true },
      _sum: { readingTime: true },
    });
    return result._sum.readingTime || 0;
  }
}
