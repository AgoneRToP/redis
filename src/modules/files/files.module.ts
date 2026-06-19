import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './models/file.model';
import { MinioModule } from '@/common/minio/minio.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MinioModule,
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
