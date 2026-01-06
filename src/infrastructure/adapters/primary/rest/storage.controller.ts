import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import {
  UploadFileUseCase,
  GetFileUrlUseCase,
} from '../../../../application/uses-cases/storage';
import { UploadFileResponseDto, FileUrlResponseDto } from '../dto/storage.dto';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly getFileUrlUseCase: GetFileUrlUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload un fichier' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadFileResponseDto })
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    const fileName = await this.uploadFileUseCase.execute({
      file: {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    });

    return { fileName };
  }

  @Get('url/:fileName')
  @ApiOperation({ summary: 'Récupérer URL signée pour un fichier' })
  @ApiResponse({ status: 200, type: FileUrlResponseDto })
  async getUrl(@Param('fileName') fileName: string): Promise<FileUrlResponseDto> {
    const url = await this.getFileUrlUseCase.execute(fileName);
    return { url };
  }
}

