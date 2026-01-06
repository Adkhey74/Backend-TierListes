import { Category } from '../value-objects/category.vo';
import { VoteDistribution } from '../value-objects/vote-distribution.vo';

export class MutualizedTierList {
  constructor(
    public readonly id: string,
    public readonly logoId: string,
    public readonly averageScore: number,
    public readonly finalRank: Category,
    public readonly voteDistribution: VoteDistribution,
    public readonly lastCalculatedAt: Date,
    public readonly pdfUrl?: string,
  ) {}

  static create(props: {
    id: string;
    logoId: string;
    averageScore?: number;
    finalRank?: Category;
    voteDistribution?: VoteDistribution;
    lastCalculatedAt?: Date;
    pdfUrl?: string;
  }): MutualizedTierList {
    const distribution = props.voteDistribution ?? VoteDistribution.create({});
    const avgScore = props.averageScore ?? distribution.getAverageScore();
    const rank =
      props.finalRank ?? MutualizedTierList.calculateRankFromScore(avgScore);

    return new MutualizedTierList(
      props.id,
      props.logoId,
      avgScore,
      rank,
      distribution,
      props.lastCalculatedAt ?? new Date(),
      props.pdfUrl,
    );
  }

  private static calculateRankFromScore(score: number): Category {
    if (score >= 4.5) return Category.create('S');
    if (score >= 3.5) return Category.create('A');
    if (score >= 2.5) return Category.create('B');
    if (score >= 1.5) return Category.create('C');
    return Category.create('D');
  }

  recalculate(newDistribution: VoteDistribution): MutualizedTierList {
    const newAvgScore = newDistribution.getAverageScore();
    const newRank = MutualizedTierList.calculateRankFromScore(newAvgScore);

    return new MutualizedTierList(
      this.id,
      this.logoId,
      newAvgScore,
      newRank,
      newDistribution,
      new Date(),
      this.pdfUrl,
    );
  }
}
