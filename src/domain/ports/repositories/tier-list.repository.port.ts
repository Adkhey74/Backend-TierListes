import { TierList, TierListStatus } from '../../entities/tier-list.entity';
import { TierListItem } from '../../entities/tier-list-item.entity';
import { CategoryRank } from '../../value-objects/category.vo';

export interface CreateTierListData {
  userId: string;
  title: string;
}

export interface CreateTierListItemData {
  tierListId: string;
  logoId: string;
  categoryRank: CategoryRank;
}

export interface TierListRepositoryPort {
  findAll(): Promise<TierList[]>;
  findById(id: string): Promise<TierList | null>;
  findByUserId(userId: string): Promise<TierList[]>;
  create(data: CreateTierListData): Promise<TierList>;
  updateStatus(id: string, status: TierListStatus): Promise<TierList>;
  delete(id: string): Promise<void>;

  // Items
  addItem(data: CreateTierListItemData): Promise<TierListItem>;
  removeItem(itemId: string): Promise<void>;
  getItems(tierListId: string): Promise<TierListItem[]>;
}

export const TIER_LIST_REPOSITORY = Symbol('TIER_LIST_REPOSITORY');
