import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({ example: '1704067200000-abc123.png' })
  fileName: string;
}

export class FileUrlResponseDto {
  @ApiProperty({ example: 'https://minio.example.com/bucket/file.png?...' })
  url: string;
}
