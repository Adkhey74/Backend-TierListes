import { Module } from '@nestjs/common';
import { LogoController } from '../../adapters/primary/rest/logo.controller';
import { PrismaLogoRepository } from '../../adapters/secondary/repositories/prisma-logo.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { LOGO_REPOSITORY } from '../../../domain/ports/repositories/logo.repository.port';
import {
  CreateLogoUseCase,
  GetAllLogosUseCase,
  GetLogoByIdUseCase,
} from '../../../application/uses-cases/logo';

@Module({
  controllers: [LogoController],
  providers: [
    PrismaService,
    {
      provide: LOGO_REPOSITORY,
      useClass: PrismaLogoRepository,
    },
    CreateLogoUseCase,
    GetAllLogosUseCase,
    GetLogoByIdUseCase,
  ],
  exports: [LOGO_REPOSITORY, GetLogoByIdUseCase, GetAllLogosUseCase],
})
export class LogoModule {}

