import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MutualizedTierList } from '../../../../domain/entities/mutualized-tier-list.entity';
import { VoteDistribution } from '../../../../domain/value-objects/vote-distribution.vo';
import {
  Category,
  CategoryRank,
} from '../../../../domain/value-objects/category.vo';
import {
  MutualizedTierListRepositoryPort,
  CreateMutualizedTierListData,
} from '../../../../domain/ports/repositories/mutualized-tier-list.repository.port';

type VoteDistributionJson = {
  S: number;
  A: number;
  B: number;
  C: number;
  D: number;
};

@Injectable()
export class PrismaMutualizedRepository implements MutualizedTierListRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(prismaMutualized: {
    id: string;
    companyId: string;
    averageScore: number;
    finalRank: string;
    voteDistribution: unknown;
    lastCalculatedAt: Date;
    pdfUrl: string | null;
  }): MutualizedTierList {
    const votes = prismaMutualized.voteDistribution as VoteDistributionJson;

    return MutualizedTierList.create({
      id: prismaMutualized.id,
      logoId: prismaMutualized.companyId,
      averageScore: prismaMutualized.averageScore,
      finalRank: Category.fromString(prismaMutualized.finalRank),
      voteDistribution: VoteDistribution.create(votes),
      lastCalculatedAt: prismaMutualized.lastCalculatedAt,
      pdfUrl: prismaMutualized.pdfUrl ?? undefined,
    });
  }

  async findAll(): Promise<MutualizedTierList[]> {
    const mutualizedList = await this.prisma.mutualizedTierList.findMany();
    return mutualizedList.map((m) => this.toDomain(m));
  }

  async findById(id: string): Promise<MutualizedTierList | null> {
    const mutualized = await this.prisma.mutualizedTierList.findUnique({
      where: { id },
    });

    if (!mutualized) return null;

    return this.toDomain(mutualized);
  }

  async findByLogoId(logoId: string): Promise<MutualizedTierList | null> {
    const mutualized = await this.prisma.mutualizedTierList.findUnique({
      where: { companyId: logoId },
    });

    if (!mutualized) return null;

    return this.toDomain(mutualized);
  }

  async create(
    data: CreateMutualizedTierListData,
  ): Promise<MutualizedTierList> {
    const mutualized = await this.prisma.mutualizedTierList.create({
      data: {
        companyId: data.logoId,
      },
    });

    return this.toDomain(mutualized);
  }

  async updateVoteDistribution(
    id: string,
    distribution: VoteDistribution,
    averageScore: number,
    finalRank: CategoryRank,
  ): Promise<MutualizedTierList> {
    const mutualized = await this.prisma.mutualizedTierList.update({
      where: { id },
      data: {
        voteDistribution: distribution.toJSON(),
        averageScore,
        finalRank,
        lastCalculatedAt: new Date(),
      },
    });

    return this.toDomain(mutualized);
  }

  async updatePdfUrl(id: string, pdfUrl: string): Promise<MutualizedTierList> {
    const mutualized = await this.prisma.mutualizedTierList.update({
      where: { id },
      data: { pdfUrl },
    });

    return this.toDomain(mutualized);
  }
}
