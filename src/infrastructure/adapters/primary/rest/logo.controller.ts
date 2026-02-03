import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateLogoUseCase,
  GetAllLogosUseCase,
  GetLogoByIdUseCase,
} from '../../../../application/uses-cases/logo';
import { CreateLogoDto, LogoResponseDto } from '../dto/logo.dto';

@ApiTags('logos')
@Controller('logos')
export class LogoController {
  constructor(
    private readonly createLogoUseCase: CreateLogoUseCase,
    private readonly getAllLogosUseCase: GetAllLogosUseCase,
    private readonly getLogoByIdUseCase: GetLogoByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les logos' })
  @ApiResponse({ status: 200, type: [LogoResponseDto] })
  async findAll(): Promise<LogoResponseDto[]> {
    const logos = await this.getAllLogosUseCase.execute();
    return logos as LogoResponseDto[];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un logo par ID' })
  @ApiResponse({ status: 200, type: LogoResponseDto })
  @ApiResponse({ status: 404, description: 'Logo non trouvé' })
  async findById(@Param('id') id: string): Promise<LogoResponseDto | null> {
    const logo = await this.getLogoByIdUseCase.execute(id);
    return logo as LogoResponseDto | null;
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau logo' })
  @ApiResponse({ status: 201, type: LogoResponseDto })
  @ApiResponse({ status: 400, description: 'Limite de logos atteinte' })
  @ApiResponse({ status: 409, description: 'Logo déjà existant' })
  async create(@Body() dto: CreateLogoDto): Promise<LogoResponseDto> {
    const logo = await this.createLogoUseCase.execute(dto);
    return logo as LogoResponseDto;
  }
}
