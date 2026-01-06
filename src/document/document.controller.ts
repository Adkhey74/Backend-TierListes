import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './adapter/document.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.documentService.uploadFile(file);
  }

  @Get('get-url/:fileName')
  async getUrl(@Param('fileName') fileName: string) {
    return this.documentService.getFileUrl(fileName);
  }
}
