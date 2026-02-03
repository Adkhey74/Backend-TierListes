import { MutualizedTierList } from '../../entities/mutualized-tier-list.entity';

export interface CreateMutualizedTierListData {
  companyId: string;
  category: 'S' | 'A' | 'B' | 'C' | 'D';
  numberOfVotes: number;
}

export interface UpdateMutualizedTierListData {
  companyId: string;
  category: 'S' | 'A' | 'B' | 'C' | 'D';
  numberOfVotes: number;
}

export interface CompanyVoteDistribution {
  companyName: string;
  voteDistribution: {
    S: number;
    A: number;
    B: number;
    C: number;
    D: number;
  };
}

export interface MutualizedTierListRepositoryPort {
  findAll(): Promise<MutualizedTierList[]>;
  findAllCompaniesWithVoteDistribution(): Promise<CompanyVoteDistribution[]>;
  findByCompanyId(companyId: string): Promise<CompanyVoteDistribution | null>;
  findByCompanyIdAndCategory(
    companyId: string,
    category: string,
  ): Promise<MutualizedTierList | null>;
  create(data: CreateMutualizedTierListData): Promise<MutualizedTierList>;
  updateNumberOfVotes(
    data: UpdateMutualizedTierListData,
  ): Promise<MutualizedTierList>;
}

export const MUTUALIZED_TIER_LIST_REPOSITORY = Symbol(
  'MUTUALIZED_TIER_LIST_REPOSITORY',
);
