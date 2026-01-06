export class VoteDistribution {
  constructor(
    public readonly S: number = 0,
    public readonly A: number = 0,
    public readonly B: number = 0,
    public readonly C: number = 0,
    public readonly D: number = 0,
  ) {}

  static create(votes: {
    S?: number;
    A?: number;
    B?: number;
    C?: number;
    D?: number;
  }): VoteDistribution {
    return new VoteDistribution(
      votes.S ?? 0,
      votes.A ?? 0,
      votes.B ?? 0,
      votes.C ?? 0,
      votes.D ?? 0,
    );
  }

  getTotalVotes(): number {
    return this.S + this.A + this.B + this.C + this.D;
  }

  getAverageScore(): number {
    const totalVotes = this.getTotalVotes();
    if (totalVotes === 0) return 0;

    const weightedSum =
      this.S * 5 + this.A * 4 + this.B * 3 + this.C * 2 + this.D * 1;
    return weightedSum / totalVotes;
  }

  addVote(rank: 'S' | 'A' | 'B' | 'C' | 'D'): VoteDistribution {
    return new VoteDistribution(
      rank === 'S' ? this.S + 1 : this.S,
      rank === 'A' ? this.A + 1 : this.A,
      rank === 'B' ? this.B + 1 : this.B,
      rank === 'C' ? this.C + 1 : this.C,
      rank === 'D' ? this.D + 1 : this.D,
    );
  }

  toJSON(): { S: number; A: number; B: number; C: number; D: number } {
    return {
      S: this.S,
      A: this.A,
      B: this.B,
      C: this.C,
      D: this.D,
    };
  }
}
