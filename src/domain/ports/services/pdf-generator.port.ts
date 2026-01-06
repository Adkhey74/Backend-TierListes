import { MutualizedTierList } from '../../entities/mutualized-tier-list.entity';

export interface PdfGeneratorPort {
  generateMutualizedTierListPdf(tierList: MutualizedTierList): Promise<Buffer>;
}

export const PDF_GENERATOR = Symbol('PDF_GENERATOR');
