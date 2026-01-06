import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateLogoDto {
  @ApiProperty({ example: 'APPLE' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;
}

export class UpdateLogoDto {
  @ApiPropertyOptional({ example: 'APPLE' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/apple-logo.png' })
  @IsUrl({}, { message: "L'URL de l'image doit être valide" })
  @IsOptional()
  imageUrl?: string;
}

export class LogoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
