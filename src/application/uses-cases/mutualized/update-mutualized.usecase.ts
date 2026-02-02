import { Inject, Injectable } from '@nestjs/common';
import { MutualizedTierList } from '../../../domain/entities/mutualized-tier-list.entity';
import {
  MutualizedTierListRepositoryPort,
  MUTUALIZED_TIER_LIST_REPOSITORY,
  UpdateMutualizedTierListData,
} from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';

@Injectable()
export class UpdateMutualizedUseCase {
  constructor(
    @Inject(MUTUALIZED_TIER_LIST_REPOSITORY)
    private readonly mutualizedRepository: MutualizedTierListRepositoryPort,
  ) {}

  async execute(
    data: UpdateMutualizedTierListData,
  ): Promise<MutualizedTierList> {
    return this.mutualizedRepository.updateNumberOfVotes(data);
  }
}
