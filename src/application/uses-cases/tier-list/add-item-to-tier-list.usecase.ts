import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TierListItem } from '../../../domain/entities/tier-list-item.entity';
import {
  TierListRepositoryPort,
  TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/tier-list.repository.port';
import { CategoryRank } from '../../../domain/value-objects/category.vo';

export interface AddItemCommand {
  tierListId: string;
  logoId: string;
  categoryRank: CategoryRank;
}

@Injectable()
export class AddItemToTierListUseCase {
  constructor(
    @Inject(TIER_LIST_REPOSITORY)
    private readonly tierListRepository: TierListRepositoryPort,
  ) {}

  async execute(command: AddItemCommand): Promise<TierListItem> {
    const tierList = await this.tierListRepository.findById(command.tierListId);

    if (!tierList) {
      throw new NotFoundException('TierList non trouvée');
    }

    if (!tierList.canAddItem()) {
      throw new BadRequestException(
        'La TierList a atteint le maximum de 10 items',
      );
    }

    return this.tierListRepository.addItem({
      tierListId: command.tierListId,
      logoId: command.logoId,
      categoryRank: command.categoryRank,
    });
  }
}

