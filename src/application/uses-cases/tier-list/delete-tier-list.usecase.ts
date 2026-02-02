import { Inject, Injectable } from '@nestjs/common';
import {
  TIER_LIST_REPOSITORY,
  TierListRepositoryPort,
} from 'src/domain/ports/repositories/tier-list.repository.port';

@Injectable()
export class DeleteTierListUseCase {
  constructor(
    @Inject(TIER_LIST_REPOSITORY)
    private readonly tierListRepository: TierListRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    return this.tierListRepository.delete(id);
  }
}
