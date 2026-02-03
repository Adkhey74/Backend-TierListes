export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface StorageServicePort {
  uploadFile(file: UploadedFile, fileName?: string): Promise<string>;
  getFileUrl(fileName: string): Promise<string>;
  /** Récupère le contenu d'un fichier stocké (buffer). Lance si le fichier n'existe pas. */
  getFile(fileName: string): Promise<Buffer>;
  deleteFile(fileName: string): Promise<void>;
}

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');
