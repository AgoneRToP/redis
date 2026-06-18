import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CreateProductDto } from './dtos';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  async getAll() {
    return await this.service.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.service.getOne(id);
  }

  @Post()
  async create(@Body() payload: CreateProductDto) {
    return await this.service.create(payload);
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: string) {
    await this.service.update(id, '');
  }
}
