import { Inject, Injectable } from '@nestjs/common';
import { MutualizedTierList } from '../../../domain/entities/mutualized-tier-list.entity';
import {
  MutualizedTierListRepositoryPort,
  MUTUALIZED_TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';
import {
  TierListRepositoryPort,
  TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/tier-list.repository.port';
import { VoteDistribution } from '../../../domain/value-objects/vote-distribution.vo';
import { CategoryRank } from '../../../domain/value-objects/category.vo';

@Injectable()
export class CalculateMutualizedUseCase {
  constructor(
    @Inject(MUTUALIZED_TIER_LIST_REPOSITORY)
    private readonly mutualizedRepository: MutualizedTierListRepositoryPort,
    @Inject(TIER_LIST_REPOSITORY)
    private readonly tierListRepository: TierListRepositoryPort,
  ) {}

  async execute(logoId: string): Promise<MutualizedTierList> {
    // Récupérer toutes les TierLists payées
    const allTierLists = await this.tierListRepository.findAll();
    const paidTierLists = allTierLists.filter((tl) => tl.isPaid());

    // Calculer la distribution des votes pour ce logo
    const votes: Record<CategoryRank, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };

    for (const tierList of paidTierLists) {
      const items = await this.tierListRepository.getItems(tierList.id);
      const itemForLogo = items.find((item) => item.logoId === logoId);

      if (itemForLogo) {
        const rank = itemForLogo.category.rank;
        votes[rank]++;
      }
    }

    const distribution = VoteDistribution.create(votes);
    const averageScore = distribution.getAverageScore();
    const finalRank = this.calculateRankFromScore(averageScore);

    // Créer ou mettre à jour le MutualizedTierList
    let mutualized = await this.mutualizedRepository.findByLogoId(logoId);

    if (!mutualized) {
      mutualized = await this.mutualizedRepository.create({ logoId });
    }

    return this.mutualizedRepository.updateVoteDistribution(
      mutualized.id,
      distribution,
      averageScore,
      finalRank,
    );
  }

  private calculateRankFromScore(score: number): CategoryRank {
    if (score >= 4.5) return 'S';
    if (score >= 3.5) return 'A';
    if (score >= 2.5) return 'B';
    if (score >= 1.5) return 'C';
    return 'D';
  }
}
