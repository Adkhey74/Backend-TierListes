import { Inject, Injectable } from '@nestjs/common';
import { Logo } from '../../../domain/entities/logo.entity';
import {
  LogoRepositoryPort,
  LOGO_REPOSITORY,
} from '../../../domain/ports/repositories/logo.repository.port';

@Injectable()
export class GetLogoByIdUseCase {
  constructor(
    @Inject(LOGO_REPOSITORY)
    private readonly logoRepository: LogoRepositoryPort,
  ) {}

  async execute(id: string): Promise<Logo | null> {
    return this.logoRepository.findById(id);
  }
}
