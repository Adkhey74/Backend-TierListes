import { TierListItem } from './tier-list-item.entity';

export enum TierListStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
}

export class TierList {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly status: TierListStatus,
    public readonly items: TierListItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    id: string;
    userId: string;
    title: string;
    status?: TierListStatus;
    items?: TierListItem[];
    createdAt?: Date;
    updatedAt?: Date;
  }): TierList {
    return new TierList(
      props.id,
      props.userId,
      props.title,
      props.status ?? TierListStatus.PENDING_PAYMENT,
      props.items ?? [],
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }

  getItems(): TierListItem[] {
    return this.items;
  }

  isPaid(): boolean {
    return this.status === TierListStatus.PAID;
  }

  canAddItem(): boolean {
    return this.items.length < 10;
  }
}
