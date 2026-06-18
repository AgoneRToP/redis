import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  constructor(private config: ConfigService) {
    this.redis = new Redis({
      port: this.config.get<number>('REDIS_PORT'),
      host: this.config.get<string>('REDIS_HOST'),
    });
  }

  async set(key: string, data: any, ttl: number = 15 * 60) {
    return await this.redis.setex(key, ttl, data);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async delete(key: string) {
    await this.redis.del(key);
  }
}
