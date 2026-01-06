import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import {
  StorageServicePort,
  UploadedFile,
} from '../../../../domain/ports/services/storage.service.port';

@Injectable()
export class MinioStorageService implements StorageServicePort {
  private readonly minioClient: Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') ?? 'localhost',
      port: this.configService.get<number>('MINIO_PORT') ?? 9000,
      useSSL: this.configService.get<boolean>('MINIO_USE_SSL') ?? false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY') ?? 'minio',
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY') ?? 'password',
    });

    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') ?? 'tierlistsbucket';

    this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
    }
  }

  async uploadFile(file: UploadedFile, fileName: string): Promise<string> {
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );

    return fileName;
  }

  async getFileUrl(fileName: string): Promise<string> {
    // URL signée valide 24h
    const expirySeconds = 24 * 60 * 60;
    return this.minioClient.presignedGetObject(
      this.bucketName,
      fileName,
      expirySeconds,
    );
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}

