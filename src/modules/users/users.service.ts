import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { RedisService } from '@/common/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<User>,
    private readonly redis: RedisService,
  ) {}

  async getAll() {
    const users = await this.model.find();
    return users;
  }

  async getOne(id: string) {
    const cached = await this.redis.get(`user:${id}`);

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.model.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.redis.set(`user:${id}`, JSON.stringify(user));

    return user;
  }

  async create(payload: CreateUserDto) {
    const existing = await this.model.findOne({ email: payload.email });

    if (existing) {
      throw new ConflictException('User already exists');
    }

    const user = await this.model.create({
      ...payload,
    });

    return user;
  }

  async update(id: string, data: any) {
    await this.redis.delete(`user:${id}`);
  }
}
