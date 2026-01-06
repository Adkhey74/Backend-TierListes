import { Module } from '@nestjs/common';
import { StorageController } from '../../adapters/primary/rest/storage.controller';
import { MinioStorageService } from '../../adapters/secondary/services/minio-storage.service';
import { STORAGE_SERVICE } from '../../../domain/ports/services/storage.service.port';
import {
  UploadFileUseCase,
  GetFileUrlUseCase,
} from '../../../application/uses-cases/storage';

@Module({
  controllers: [StorageController],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: MinioStorageService,
    },
    UploadFileUseCase,
    GetFileUrlUseCase,
  ],
  exports: [STORAGE_SERVICE, UploadFileUseCase, GetFileUrlUseCase],
})
export class StorageModule {}
