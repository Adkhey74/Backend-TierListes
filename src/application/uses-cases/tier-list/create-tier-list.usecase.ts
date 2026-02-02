import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { TierList } from '../../../domain/entities/tier-list.entity';
import { TierListItem } from '../../../domain/entities/tier-list-item.entity';
import { Category } from '../../../domain/value-objects/category.vo';
import {
  TierListRepositoryPort,
  TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/tier-list.repository.port';
import {
  MutualizedTierListRepositoryPort,
  MUTUALIZED_TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';

export interface CreateTierListItemInput {
  id?: string;
  logoId: string;
  category: string;
}

export interface CreateTierListCommand {
  userId: string;
  title: string;
  items?: CreateTierListItemInput[];
}

@Injectable()
export class CreateTierListUseCase {
  constructor(
    @Inject(TIER_LIST_REPOSITORY)
    private readonly tierListRepository: TierListRepositoryPort,
    @Inject(MUTUALIZED_TIER_LIST_REPOSITORY)
    private readonly mutualizedRepository: MutualizedTierListRepositoryPort,
  ) {}

  async execute(command: CreateTierListCommand): Promise<TierList> {
    const tierList = await this.tierListRepository.create({
      userId: command.userId,
      title: command.title,
    });

    const items = command.items ?? [];
    if (items.length > 0) {
      if (items.length > 10) {
        throw new BadRequestException(
          'Une TierList ne peut pas contenir plus de 10 items',
        );
      }
      const domainItems = items.map((item) =>
        TierListItem.create({
          id: item.id ?? crypto.randomUUID(),
          tierListId: tierList.id,
          logoId: item.logoId,
          category: Category.fromString(item.category),
        }),
      );
      await this.tierListRepository.saveItems(domainItems, tierList.id);
      await this.syncItemsToMutualized(domainItems);
      const withItems = await this.tierListRepository.findById(tierList.id);
      return withItems!;
    }

    return tierList;
  }

  private async syncItemsToMutualized(items: TierListItem[]): Promise<void> {
    for (const item of items) {
      const companyId = item.logoId;
      const category = item.category.rank;
      const existing =
        await this.mutualizedRepository.findByCompanyIdAndCategory(
          companyId,
          category,
        );
      if (existing) {
        await this.mutualizedRepository.updateNumberOfVotes({
          companyId,
          category,
          numberOfVotes: existing.numberOfVotes + 1,
        });
      } else {
        await this.mutualizedRepository.create({
          companyId,
          category,
          numberOfVotes: 1,
        });
      }
    }
  }
}
