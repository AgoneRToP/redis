import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './models';
import { Model } from 'mongoose';
import { MinioService } from '@/common/minio/minio.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly model: Model<File>,
    private readonly service: MinioService,
  ) {}

  async upload(file: Express.Multer.File) {
    const { fileName } = await this.service.upload(file);

    return await this.model.create({ fileName });
  }

  async delete(file_id: string) {
    const file = await this.model.findById(file_id);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.service.delete(file.fileName);
  }

  async getOne(file_id: string) {
    const file = await this.model.findById(file_id);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const url = await this.service.getPresignedUrl(file.fileName);

    return {
      presignedUrl: url,
    };
  }
}
