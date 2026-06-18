import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async getAll() {
    return await this.service.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.service.getOne(id);
  }

  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.service.create(payload);
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: string) {
    await this.service.update(id, '');
  }
}
