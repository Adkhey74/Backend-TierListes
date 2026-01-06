import { MutualizedTierList } from '../../entities/mutualized-tier-list.entity';
import { VoteDistribution } from '../../value-objects/vote-distribution.vo';
import { CategoryRank } from '../../value-objects/category.vo';

export interface CreateMutualizedTierListData {
  logoId: string;
}

export interface MutualizedTierListRepositoryPort {
  findAll(): Promise<MutualizedTierList[]>;
  findById(id: string): Promise<MutualizedTierList | null>;
  findByLogoId(logoId: string): Promise<MutualizedTierList | null>;
  create(data: CreateMutualizedTierListData): Promise<MutualizedTierList>;
  updateVoteDistribution(
    id: string,
    distribution: VoteDistribution,
    averageScore: number,
    finalRank: CategoryRank,
  ): Promise<MutualizedTierList>;
  updatePdfUrl(id: string, pdfUrl: string): Promise<MutualizedTierList>;
}

export const MUTUALIZED_TIER_LIST_REPOSITORY = Symbol(
  'MUTUALIZED_TIER_LIST_REPOSITORY',
);
