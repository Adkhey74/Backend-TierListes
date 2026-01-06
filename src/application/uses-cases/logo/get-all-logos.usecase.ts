import { Inject, Injectable } from '@nestjs/common';
import { Logo } from '../../../domain/entities/logo.entity';
import {
  LogoRepositoryPort,
  LOGO_REPOSITORY,
} from '../../../domain/ports/repositories/logo.repository.port';

@Injectable()
export class GetAllLogosUseCase {
  constructor(
    @Inject(LOGO_REPOSITORY)
    private readonly logoRepository: LogoRepositoryPort,
  ) {}

  async execute(): Promise<Logo[]> {
    return this.logoRepository.findAll();
  }
}
