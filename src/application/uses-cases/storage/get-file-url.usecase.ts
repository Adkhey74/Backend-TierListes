import { Inject, Injectable } from '@nestjs/common';
import {
  StorageServicePort,
  STORAGE_SERVICE,
} from '../../../domain/ports/services/storage.service.port';

@Injectable()
export class GetFileUrlUseCase {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageServicePort,
  ) {}

  async execute(fileName: string): Promise<string> {
    return this.storageService.getFileUrl(fileName);
  }
}
