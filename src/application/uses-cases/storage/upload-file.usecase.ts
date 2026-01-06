import { Inject, Injectable } from '@nestjs/common';
import {
  StorageServicePort,
  STORAGE_SERVICE,
  UploadedFile,
} from '../../../domain/ports/services/storage.service.port';

export interface UploadFileCommand {
  file: UploadedFile;
  customFileName?: string;
}

@Injectable()
export class UploadFileUseCase {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageServicePort,
  ) {}

  async execute(command: UploadFileCommand): Promise<string> {
    const fileName =
      command.customFileName ?? this.generateFileName(command.file);
    return this.storageService.uploadFile(command.file, fileName);
  }

  private generateFileName(file: UploadedFile): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.originalname.split('.').pop() ?? 'bin';
    return `${timestamp}-${randomString}.${extension}`;
  }
}
