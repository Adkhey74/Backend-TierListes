import {
  Inject,
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Logo } from '../../../domain/entities/logo.entity';
import {
  LogoRepositoryPort,
  LOGO_REPOSITORY,
} from '../../../domain/ports/repositories/logo.repository.port';

export interface CreateLogoCommand {
  name: string;
}

const MAX_LOGOS = 10;

@Injectable()
export class CreateLogoUseCase {
  constructor(
    @Inject(LOGO_REPOSITORY)
    private readonly logoRepository: LogoRepositoryPort,
  ) {}

  async execute(command: CreateLogoCommand): Promise<Logo> {
    // Vérifier la limite de logos
    const count = await this.logoRepository.count();
    if (count >= MAX_LOGOS) {
      throw new BadRequestException(
        `Le nombre maximum de logos (${MAX_LOGOS}) a été atteint`,
      );
    }

    // Vérifier si le logo existe déjà
    const normalizedName = command.name.toUpperCase();
    const existingLogo = await this.logoRepository.findByName(normalizedName);

    if (existingLogo) {
      throw new ConflictException('Un logo avec ce nom existe déjà');
    }

    return this.logoRepository.create({
      name: normalizedName,
    });
  }
}
