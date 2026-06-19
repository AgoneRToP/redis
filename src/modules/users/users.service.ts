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
import { MinioService } from '@/common/minio/minio.service';
import { File } from '../files/models';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<User>,
    @InjectModel(File.name) private readonly modelFile: Model<File>,
    private readonly service: MinioService,
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

    const { fileName } = await this.service.upload(payload.file);
    const file = await this.modelFile.create({ fileName });

    const user = await this.model.create({
      ...payload,
      file,
    });

    return user;
  }

  async update(id: string, data: any) {
    await this.redis.delete(`user:${id}`);
  }
}
