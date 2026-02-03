import { Inject, Injectable } from '@nestjs/common';
import {
  CompanyVoteDistribution,
  MutualizedTierListRepositoryPort,
  MUTUALIZED_TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';

@Injectable()
export class GetAllMutualizedUseCase {
  constructor(
    @Inject(MUTUALIZED_TIER_LIST_REPOSITORY)
    private readonly mutualizedRepository: MutualizedTierListRepositoryPort,
  ) {}

  async execute(): Promise<CompanyVoteDistribution[]> {
    return this.mutualizedRepository.findAllCompaniesWithVoteDistribution();
  }
}
