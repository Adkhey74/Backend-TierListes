import { Inject, Injectable } from '@nestjs/common';
import { TierList } from '../../../domain/entities/tier-list.entity';
import {
  TierListRepositoryPort,
  TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/tier-list.repository.port';

@Injectable()
export class GetUserTierListsUseCase {
  constructor(
    @Inject(TIER_LIST_REPOSITORY)
    private readonly tierListRepository: TierListRepositoryPort,
  ) {}

  async execute(userId: string): Promise<TierList[]> {
    return this.tierListRepository.findByUserId(userId);
  }
}
