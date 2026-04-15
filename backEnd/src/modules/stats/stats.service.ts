import { Injectable } from '@nestjs/common';
import { PresenceService } from '../presence/presence.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly presenceService: PresenceService,
  ) {}

  async getSiteStats() {
    const [postCount, categoryCount, tagCount, onlineUsers] = await Promise.all(
      [
        this.prisma.post.count({ where: { published: true } }),
        this.prisma.category.count(),
        this.prisma.tag.count(),
        this.presenceService.getOnlineUsers(),
      ],
    );

    return {
      postCount,
      categoryCount,
      tagCount,
      onlineUsers,
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
    ] = await Promise.all([
      this.prisma.post.count(),
      this.prisma.post.count({ where: { published: true } }),
      this.prisma.post.count({ where: { published: false } }),
      this.prisma.category.count(),
      this.prisma.tag.count(),
      this.presenceService.getOnlineUsers(),
    ]);

    return {
      postCount,
      publishedPostCount,
      draftPostCount,
      categoryCount,
      tagCount,
      onlineUsers,
    };
  }
}
