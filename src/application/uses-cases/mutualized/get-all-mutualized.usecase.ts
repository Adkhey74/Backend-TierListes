import { Inject, Injectable } from '@nestjs/common';
import { MutualizedTierList } from '../../../domain/entities/mutualized-tier-list.entity';
import {
  MutualizedTierListRepositoryPort,
  MUTUALIZED_TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';

@Injectable()
export class GetAllMutualizedUseCase {
  constructor(
    @Inject(MUTUALIZED_TIER_LIST_REPOSITORY)
    private readonly mutualizedRepository: MutualizedTierListRepositoryPort,
  ) {}

  async execute(): Promise<MutualizedTierList[]> {
    return this.mutualizedRepository.findAll();
  }
}

