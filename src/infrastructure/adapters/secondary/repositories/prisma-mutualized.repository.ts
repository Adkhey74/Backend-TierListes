import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MutualizedTierList } from '../../../../domain/entities/mutualized-tier-list.entity';
import {
  MutualizedTierListRepositoryPort,
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
