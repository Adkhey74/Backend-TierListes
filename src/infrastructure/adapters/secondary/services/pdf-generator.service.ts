import { Injectable } from '@nestjs/common';
import { MutualizedTierList } from '../../../../domain/entities/mutualized-tier-list.entity';
import { PdfGeneratorPort } from '../../../../domain/ports/services/pdf-generator.port';

@Injectable()
export class PdfGeneratorService implements PdfGeneratorPort {
  async generateMutualizedTierListPdf(
    tierList: MutualizedTierList,
  ): Promise<Buffer> {
    // TODO: Implémenter avec une vraie lib PDF (pdfkit, puppeteer, etc.)
    // Pour l'instant, génère un PDF simple mock

    const content = `
      MutualizedTierList Report
      =========================
      Logo ID: ${tierList.logoId}
      Average Score: ${tierList.averageScore.toFixed(2)}
      Final Rank: ${tierList.finalRank.rank}
      Total Votes: ${tierList.voteDistribution.getTotalVotes()}
      
      Vote Distribution:
      S: ${tierList.voteDistribution.S}
      A: ${tierList.voteDistribution.A}
      B: ${tierList.voteDistribution.B}
      C: ${tierList.voteDistribution.C}
      D: ${tierList.voteDistribution.D}
      
      Generated at: ${new Date().toISOString()}
    `;

    // Retourne le contenu comme buffer (mock)
    return Buffer.from(content, 'utf-8');
  }
}
