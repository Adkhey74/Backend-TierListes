import { Injectable } from '@nestjs/common';
import { ObjectStoragePort } from '../domain/objectStorage.port';
import { MinioClient } from '../domain/minioClient';

@Injectable()
export class DocumentService implements ObjectStoragePort {
  async getFileUrl(fileName: string): Promise<string> {
    const bucketName = 'tierlistsbucket';
    const url = await MinioClient.presignedGetObject(bucketName, fileName);
    return url;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucketName = 'tierlistsbucket';
    const fileName = `test`;

    await MinioClient.putObject(bucketName, fileName, file.buffer);

    return fileName;
  }
}
