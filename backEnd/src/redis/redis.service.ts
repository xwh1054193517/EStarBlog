import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('REDIS_URL');
    this.client = url
      ? new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1 })
      : new Redis({
          host: this.configService.get<string>('REDIS_HOST') ?? '127.0.0.1',
          port: Number(this.configService.get<string>('REDIS_PORT') ?? 6379),
          password:
            this.configService.get<string>('REDIS_PASSWORD') ?? undefined,
          db: Number(this.configService.get<string>('REDIS_DB') ?? 0),
          lazyConnect: true,
          maxRetriesPerRequest: 1,
        });
  }

  async getClient() {
    if (this.client.status !== 'ready') {
      await this.client.connect().catch((error) => {
        this.logger.error(`Redis connect failed: ${String(error)}`);
        throw error;
      });
    }
    return this.client;
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    const client = await this.getClient();
    if (ttlSeconds) {
      await client.set(key, value, 'EX', ttlSeconds);
      return;
    }
    await client.set(key, value);
  }

  async get(key: string) {
    return (await this.getClient()).get(key);
  }

  async del(key: string) {
    return (await this.getClient()).del(key);
  }

  async zadd(key: string, score: number, member: string) {
    return (await this.getClient()).zadd(key, score, member);
  }

  async zremrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
  ) {
    return (await this.getClient()).zremrangebyscore(key, min, max);
  }

  async zcard(key: string) {
    return (await this.getClient()).zcard(key);
  }

  async incrby(key: string, value: number) {
    return (await this.getClient()).incrby(key, value);
  }

  async keys(pattern: string) {
    return (await this.getClient()).keys(pattern);
  }
  async scan(cursor: string, pattern?: string, count?: number) {
    const client = await this.getClient();

    if (pattern !== undefined && count !== undefined) {
      return client.scan(cursor, 'MATCH', pattern, 'COUNT', count) as Promise<
        [string, string[]]
      >;
    }

    if (pattern !== undefined) {
      return client.scan(cursor, 'MATCH', pattern) as Promise<
        [string, string[]]
      >;
    }

    if (count !== undefined) {
      return client.scan(cursor, 'COUNT', count) as Promise<[string, string[]]>;
    }

    return client.scan(cursor) as Promise<[string, string[]]>;
  }

  async getdel(key: string) {
    const client = await this.getClient();

    // ioredis 没有始终稳定暴露 getdel 方法时，直接走原生命令最稳
    return client.call('GETDEL', key) as Promise<string | null>;
  }
  async onModuleDestroy() {
    await this.client.quit().catch(() => undefined);
  }
}
