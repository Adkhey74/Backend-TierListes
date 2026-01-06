import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  TierList,
  TierListStatus,
} from '../../../../domain/entities/tier-list.entity';
import { TierListItem } from '../../../../domain/entities/tier-list-item.entity';
import {
  Category,
  CategoryRank,
} from '../../../../domain/value-objects/category.vo';
import {
  TierListRepositoryPort,
  CreateTierListData,
  CreateTierListItemData,
} from '../../../../domain/ports/repositories/tier-list.repository.port';
import { TierListStatus as PrismaTierListStatus } from 'generated/prisma/enums';

@Injectable()
export class PrismaTierListRepository implements TierListRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomainItem(prismaItem: {
    id: string;
    tierListId: string;
    companyId: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }): TierListItem {
    return TierListItem.create({
      id: prismaItem.id,
      tierListId: prismaItem.tierListId,
      logoId: prismaItem.companyId,
      category: Category.fromString(prismaItem.category),
      createdAt: prismaItem.createdAt,
      updatedAt: prismaItem.updatedAt,
    });
  }

  private toDomain(
    prismaTierList: {
      id: string;
      userId: string;
      title: string;
      status: PrismaTierListStatus;
      createdAt: Date;
      updatedAt: Date;
    },
    items: TierListItem[] = [],
  ): TierList {
    return TierList.create({
      id: prismaTierList.id,
      userId: prismaTierList.userId,
      title: prismaTierList.title,
      status: prismaTierList.status as unknown as TierListStatus,
      items,
      createdAt: prismaTierList.createdAt,
      updatedAt: prismaTierList.updatedAt,
    });
  }

  async findAll(): Promise<TierList[]> {
    const tierLists = await this.prisma.tierList.findMany({
      include: { items: true },
    });

    return tierLists.map((tl) =>
      this.toDomain(
        tl,
        tl.items.map((item) => this.toDomainItem(item)),
      ),
    );
  }

  async findById(id: string): Promise<TierList | null> {
    const tierList = await this.prisma.tierList.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!tierList) return null;

    return this.toDomain(
      tierList,
      tierList.items.map((item) => this.toDomainItem(item)),
    );
  }

  async findByUserId(userId: string): Promise<TierList[]> {
    const tierLists = await this.prisma.tierList.findMany({
      where: { userId },
      include: { items: true },
    });

    return tierLists.map((tl) =>
      this.toDomain(
        tl,
        tl.items.map((item) => this.toDomainItem(item)),
      ),
    );
  }

  async create(data: CreateTierListData): Promise<TierList> {
    const tierList = await this.prisma.tierList.create({
      data: {
        userId: data.userId,
        title: data.title,
      },
      include: { items: true },
    });

    return this.toDomain(tierList, []);
  }

  async updateStatus(id: string, status: TierListStatus): Promise<TierList> {
    const tierList = await this.prisma.tierList.update({
      where: { id },
      data: { status: status as unknown as PrismaTierListStatus },
      include: { items: true },
    });

    return this.toDomain(
      tierList,
      tierList.items.map((item) => this.toDomainItem(item)),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tierList.delete({ where: { id } });
  }

  async addItem(data: CreateTierListItemData): Promise<TierListItem> {
    const item = await this.prisma.tierListItem.create({
      data: {
        tierListId: data.tierListId,
        companyId: data.logoId,
        category: data.categoryRank,
      },
    });

    return this.toDomainItem(item);
  }

  async removeItem(itemId: string): Promise<void> {
    await this.prisma.tierListItem.delete({ where: { id: itemId } });
  }

  async getItems(tierListId: string): Promise<TierListItem[]> {
    const items = await this.prisma.tierListItem.findMany({
      where: { tierListId },
    });

    return items.map((item) => this.toDomainItem(item));
  }
}
