import { Category } from '../value-objects/category.vo';

export class TierListItem {
  constructor(
    public readonly id: string,
    public readonly tierListId: string,
    public readonly logoId: string,
    public readonly category: Category,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: {
    id: string;
    tierListId: string;
    logoId: string;
    category: Category;
    createdAt?: Date;
    updatedAt?: Date;
  }): TierListItem {
    return new TierListItem(
      props.id,
      props.tierListId,
      props.logoId,
      props.category,
      props.createdAt,
      props.updatedAt,
    );
  }
}
