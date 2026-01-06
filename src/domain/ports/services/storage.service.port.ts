export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface StorageServicePort {
  uploadFile(file: UploadedFile, fileName?: string): Promise<string>;
  getFileUrl(fileName: string): Promise<string>;
  deleteFile(fileName: string): Promise<void>;
}

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');
