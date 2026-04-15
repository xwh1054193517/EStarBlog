import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class PresenceService {
  private readonly ttlSeconds = 90;
  private readonly heartbeatKey = 'presence:visitors';

  constructor(private readonly redisService: RedisService) {}

  async heartbeat(visitorId: string) {
    const now = Date.now();
    await this.redisService.zadd(this.heartbeatKey, now, visitorId);
    await this.cleanup(now);
    return {
      visitorId,
      onlineUsers: await this.redisService.zcard(this.heartbeatKey),
    };
  }

  async getOnlineUsers() {
    await this.cleanup(Date.now());
    return this.redisService.zcard(this.heartbeatKey);
  }

  private async cleanup(now: number) {
    const threshold = now - this.ttlSeconds * 1000;
    await this.redisService.zremrangebyscore(this.heartbeatKey, 0, threshold);
  }
}
