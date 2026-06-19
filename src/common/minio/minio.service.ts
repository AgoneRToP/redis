import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { randomUUID } from 'node:crypto';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly minioClient: Client;
  private readonly bucketName: string;
  constructor(private readonly config: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.config.getOrThrow<string>('MINIO_HOST'),
      port: this.config.getOrThrow<number>('MINIO_PORT'),
      accessKey: this.config.getOrThrow<string>('MINIO_ACCESS_KEY'),
      secretKey: this.config.getOrThrow<string>('MINIO_SECRET_KEY'),
      useSSL: false,
    });

    this.bucketName = this.config.getOrThrow<string>('MINIO_BUCKET');
  }

  async onModuleInit() {
    const bucketName = this.config.getOrThrow<string>('MINIO_BUCKET');
    const isExists = await this.minioClient.bucketExists(bucketName);

    if (!isExists) {
      await this.minioClient.makeBucket(bucketName);
    }
  }

  async upload(file: Express.Multer.File) {
    try {
      const fileName = `${randomUUID}.${file.originalname.split('.').at(-1)}`;
      const res = await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
      );
      return {
        res,
        fileName,
      };
    } catch (error) {
      console.log('Error while uploading file to MINIO');
      throw error
    }
  }

  async delete(fileName: string) {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
    } catch (error) {
      console.log('Error while deleting object from MINIO');
    }
  }

  async getPresignedUrl(fileName: string) {
    try {
      return await this.minioClient.presignedUrl(
        'GET',
        this.bucketName,
        fileName,
        60 * 60,
      );
    } catch (error) {
      console.log('Error while getting presignedUrl from MINIO');
    }
  }
}
