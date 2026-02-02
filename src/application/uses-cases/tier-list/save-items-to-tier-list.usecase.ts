import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  TierListRepositoryPort,
  TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/tier-list.repository.port';
import {
  MutualizedTierListRepositoryPort,
  MUTUALIZED_TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';
import { TierListItem } from '../../../domain/entities/tier-list-item.entity';
import { Category } from '../../../domain/value-objects/category.vo';
export interface SaveItemsToTierListCommand {
  items: { id?: string; logoId: string; category: string }[];
}

@Injectable()
export class SaveItemsToTierListUseCase {
  constructor(
    @Inject(TIER_LIST_REPOSITORY)
    private readonly tierListRepository: TierListRepositoryPort,
    @Inject(MUTUALIZED_TIER_LIST_REPOSITORY)
    private readonly mutualizedRepository: MutualizedTierListRepositoryPort,
  ) {}

  async execute(
    command: SaveItemsToTierListCommand,
    tierListId: string,
  ): Promise<void> {
    const tierList = await this.tierListRepository.findById(tierListId);

    if (!tierList) {
      throw new NotFoundException('TierList non trouvée');
    }

    const items = command.items;
    if (items.length > 10) {
      throw new BadRequestException(
        'Une TierList ne peut pas contenir plus de 10 items',
      );
    }

    const domainItems = items.map((item) =>
      TierListItem.create({
        id: item.id ?? crypto.randomUUID(),
        tierListId,
        logoId: item.logoId,
        category: Category.fromString(item.category),
      }),
    );

    await this.tierListRepository.saveItems(domainItems, tierListId);
    await this.syncItemsToMutualized(domainItems);
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
