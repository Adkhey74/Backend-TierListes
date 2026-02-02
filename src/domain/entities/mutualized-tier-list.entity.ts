export class MutualizedTierList {
  constructor(
    public readonly companyId: string,
    public readonly category: 'S' | 'A' | 'B' | 'C' | 'D',
    public readonly numberOfVotes: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: {
    companyId: string;
    category: 'S' | 'A' | 'B' | 'C' | 'D';
    numberOfVotes: number;
    createdAt?: Date;
    updatedAt?: Date;
  }): MutualizedTierList {
    return new MutualizedTierList(
      props.companyId,
      props.category,
      props.numberOfVotes,
      props.createdAt,
      props.updatedAt,
    );
  }
}
