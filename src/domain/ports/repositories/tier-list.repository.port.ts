import { TierList, TierListStatus } from '../../entities/tier-list.entity';
import { TierListItem } from '../../entities/tier-list-item.entity';
import { CategoryRank } from '../../value-objects/category.vo';

export interface CreateTierListData {
  userId: string;
  title: string;
}

export interface CreateTierListItemData {
  logoId: string;
  categoryRank: CategoryRank;
}

export interface UpdateTierListData {
  title: string;
}

export interface TierListRepositoryPort {
  findAll(): Promise<TierList[]>;
  findById(id: string): Promise<TierList | null>;
  findByUserId(userId: string): Promise<TierList[]>;
  create(data: CreateTierListData): Promise<TierList>;
  update(
    id: string,
    userId: string,
    data: UpdateTierListData,
  ): Promise<TierList>;
  updateStatus(id: string, status: TierListStatus): Promise<TierList>;
  delete(id: string): Promise<void>;

  // Items
  saveItems(items: TierListItem[], tierListId: string): Promise<void>;
  deleteItems(tierListId: string): Promise<void>;
  getItems(tierListId: string): Promise<TierListItem[]>;
}

export const TIER_LIST_REPOSITORY = Symbol('TIER_LIST_REPOSITORY');
