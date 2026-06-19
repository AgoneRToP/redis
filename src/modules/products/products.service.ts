import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './models';
import { Model } from 'mongoose';
import { CreateProductDto } from './dtos';
import { RedisService } from '@/common/redis/redis.service';
import { MinioService } from '@/common/minio/minio.service';
import { File } from '../files/models';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<Product>,
        @InjectModel(File.name) private readonly modelFile: Model<File>,
        private readonly service: MinioService,
    private readonly redis: RedisService,
  ) {}

  async getAll() {
    const products = await this.model.find();
    return products;
  }

  async getOne(id: string) {
    const cached = await this.redis.get(`product:${id}`);

    if (cached) {
      return JSON.parse(cached);
    }

    const product = await this.model.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.redis.set(`product:${id}`, JSON.stringify(product));

    return product;
  }

  async create(payload: CreateProductDto) {
    const { fileName } = await this.service.upload(payload.file);
    const file = await this.modelFile.create({ fileName });

    const product = await this.model.create({
      ...payload,
      file,
    });

    return product;
  }

  async update(id: string, data: any) {
    await this.redis.delete(`product:${id}`);
  }
}
