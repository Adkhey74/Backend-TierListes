import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MutualizedTierList } from '../../../../domain/entities/mutualized-tier-list.entity';
import {
  MutualizedTierListRepositoryPort,
  CompanyVoteDistribution,
  CreateMutualizedTierListData,
  UpdateMutualizedTierListData,
} from '../../../../domain/ports/repositories/mutualized-tier-list.repository.port';

@Injectable()
export class PrismaMutualizedRepository implements MutualizedTierListRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(prismaMutualized: {
    companyId: string;
    category: string;
    numberOfVotes: number;
    createdAt: Date;
    updatedAt: Date;
  }): MutualizedTierList {
    return MutualizedTierList.create({
      companyId: prismaMutualized.companyId,
      category: prismaMutualized.category as 'S' | 'A' | 'B' | 'C' | 'D',
      numberOfVotes: prismaMutualized.numberOfVotes,
      createdAt: prismaMutualized.createdAt,
      updatedAt: prismaMutualized.updatedAt,
    });
  }

  async findAll(): Promise<MutualizedTierList[]> {
    const mutualizedList = await this.prisma.mutualizedTierList.findMany();
    return mutualizedList.map((m) => this.toDomain(m));
  }

  async findAllCompaniesWithVoteDistribution(): Promise<
    CompanyVoteDistribution[]
  > {
    const companies = await this.prisma.company.findMany({
      include: { mutualizedTierLists: true },
      orderBy: { name: 'asc' },
    });
    return companies.map((company) => {
      const voteDistribution = { S: 0, A: 0, B: 0, C: 0, D: 0 };
      for (const row of company.mutualizedTierLists) {
        const cat = row.category as keyof typeof voteDistribution;
        if (cat in voteDistribution) {
          voteDistribution[cat] = row.numberOfVotes;
        }
      }
      return {
        companyName: company.name,
        voteDistribution,
      };
    });
  }

  async findByCompanyId(
    companyId: string,
  ): Promise<CompanyVoteDistribution | null> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        mutualizedTierLists: true,
      },
    });
    if (!company) return null;

    const voteDistribution = { S: 0, A: 0, B: 0, C: 0, D: 0 };
    for (const row of company.mutualizedTierLists) {
      const cat = row.category as keyof typeof voteDistribution;
      if (cat in voteDistribution) {
        voteDistribution[cat] = row.numberOfVotes;
      }
    }
    return {
      companyName: company.name,
      voteDistribution,
    };
  }

  async findByCompanyIdAndCategory(
    companyId: string,
    category: string,
  ): Promise<MutualizedTierList | null> {
    const mutualized = await this.prisma.mutualizedTierList.findUnique({
      where: {
        companyId_category: { companyId, category },
      },
    });

    if (!mutualized) return null;

    return this.toDomain(mutualized);
  }

  async create(
    data: CreateMutualizedTierListData,
  ): Promise<MutualizedTierList> {
    const mutualized = await this.prisma.mutualizedTierList.create({
      data: {
        companyId: data.companyId,
        category: data.category,
        numberOfVotes: data.numberOfVotes,
      },
    });

    return this.toDomain(mutualized);
  }

  async updateNumberOfVotes(
    data: UpdateMutualizedTierListData,
  ): Promise<MutualizedTierList> {
    const mutualized = await this.prisma.mutualizedTierList.update({
      where: {
        companyId_category: {
          companyId: data.companyId,
          category: data.category,
        },
      },
      data: {
        numberOfVotes: data.numberOfVotes,
      },
    });

    return this.toDomain(mutualized);
  }
}
