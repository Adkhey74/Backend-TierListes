export type CategoryRank = 'S' | 'A' | 'B' | 'C' | 'D';

const CATEGORY_SCORES: Record<CategoryRank, number> = {
  S: 5,
  A: 4,
  B: 3,
  C: 2,
  D: 1,
};

export class Category {
  constructor(
    public readonly rank: CategoryRank,
    public readonly score: number = CATEGORY_SCORES[rank],
  ) {}

  static create(rank: CategoryRank): Category {
    return new Category(rank, CATEGORY_SCORES[rank]);
  }

  static fromString(rank: string): Category {
    const validRanks: CategoryRank[] = ['S', 'A', 'B', 'C', 'D'];
    if (!validRanks.includes(rank as CategoryRank)) {
      throw new Error(`Invalid category rank: ${rank}`);
    }
    return Category.create(rank as CategoryRank);
  }

  getScore(): number {
    return this.score;
  }

  equals(other: Category): boolean {
    return this.rank === other.rank;
  }

  toString(): string {
    return this.rank;
  }
}
