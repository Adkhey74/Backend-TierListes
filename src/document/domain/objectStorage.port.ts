export interface ObjectStoragePort {
  uploadFile(file: Express.Multer.File): Promise<string>;
  getFileUrl(fileName: string): Promise<string>;
}
