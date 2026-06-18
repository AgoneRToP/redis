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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<Product>,
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
    const product = await this.model.create({
      ...payload,
    });

    return product;
  }

  async update(id: string, data: any) {
    await this.redis.delete(`product:${id}`);
  }
}
