import { MutualizedTierList } from '../../entities/mutualized-tier-list.entity';

export interface VoteDistributionForPdf {
  S: number;
  A: number;
  B: number;
  C: number;
  D: number;
}

export type CompanyStatsForPdf = {
  companyName: string;
  voteDistribution: VoteDistributionForPdf;
};

export interface PdfGeneratorPort {
  generateMutualizedTierListPdf(tierList: MutualizedTierList): Promise<Buffer>;
  /** Génère un PDF rapport : nom de la company (gras) + rangs avec nombre de votes. */
  generateReportPdf(
    companyName: string,
    voteDistribution: VoteDistributionForPdf,
  ): Promise<Buffer>;
  /** Génère un PDF rapport listant toutes les entreprises avec leurs stats (S, A, B, C, D). */
  generateFullReportPdf(items: CompanyStatsForPdf[]): Promise<Buffer>;
}

export const PDF_GENERATOR = Symbol('PDF_GENERATOR');
