export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class Payment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly tierListId: string,
    public readonly amount: number,
    public readonly stripePaymentId: string,
    public readonly status: PaymentStatus,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    id: string;
    userId: string;
    tierListId: string;
    amount: number;
    stripePaymentId: string;
    status?: PaymentStatus;
    createdAt?: Date;
  }): Payment {
    return new Payment(
      props.id,
      props.userId,
      props.tierListId,
      props.amount,
      props.stripePaymentId,
      props.status ?? PaymentStatus.PENDING,
      props.createdAt ?? new Date(),
    );
  }

  isSuccessful(): boolean {
    return this.status === PaymentStatus.SUCCESS;
  }

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }
}
