import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { MutualizedTierList } from '../../../../domain/entities/mutualized-tier-list.entity';
import {
  PdfGeneratorPort,
  VoteDistributionForPdf,
  CompanyStatsForPdf,
} from '../../../../domain/ports/services/pdf-generator.port';

type PdfDoc = InstanceType<typeof PDFDocument>;

const MARGIN = 50;
const PAGE_WIDTH = 595;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/** Couleurs type tier-list (S à D) — alignées sur Tailwind bg-*-500 */
const RANK_COLORS: Record<string, string> = {
  S: '#EF4444', // red-500
  A: '#EAB308', // yellow-500
  B: '#22C55E', // green-500
  C: '#3B82F6', // blue-500
  D: '#A855F7', // purple-500
  default: '#6B7280', // gray-500
};

@Injectable()
export class PdfGeneratorService implements PdfGeneratorPort {
  async generateMutualizedTierListPdf(
    tierList: MutualizedTierList,
  ): Promise<Buffer> {
    const { companyId, category, numberOfVotes } = tierList;
    const voteDistribution: VoteDistributionForPdf = {
      S: category === 'S' ? numberOfVotes : 0,
      A: category === 'A' ? numberOfVotes : 0,
      B: category === 'B' ? numberOfVotes : 0,
      C: category === 'C' ? numberOfVotes : 0,
      D: category === 'D' ? numberOfVotes : 0,
    };
    return this.generateReportPdf(companyId, voteDistribution);
  }

  async generateReportPdf(
    companyName: string,
    voteDistribution: VoteDistributionForPdf,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: MARGIN, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc
        .fontSize(22)
        .font('Helvetica-Bold')
        .fillColor('#1E293B')
        .text(companyName);
      doc.moveDown(1);
      const ranks: (keyof VoteDistributionForPdf)[] = ['S', 'A', 'B', 'C', 'D'];
      doc.fontSize(11).font('Helvetica');
      for (const rank of ranks) {
        doc.fillColor(RANK_COLORS[rank] ?? RANK_COLORS.default);
        doc.text(`  ${rank} : ${voteDistribution[rank]} vote(s)`);
        doc.fillColor('#334155');
      }
      doc.end();
    });
  }

  private drawHeader(doc: PdfDoc): void {
    doc.rect(0, 0, PAGE_WIDTH, 72).fill('#1E293B');
    doc.fillColor('#F8FAFC').fontSize(24).font('Helvetica-Bold');
    doc.text('Rapport mutualisé', MARGIN, 22);
    doc.fontSize(11).font('Helvetica');
    doc.text(
      `Généré le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
      MARGIN,
      48,
    );
    doc.fillColor('#334155');
    doc.y = 90;
  }

  private drawCompanyCard(
    doc: PdfDoc,
    companyName: string,
    voteDistribution: VoteDistributionForPdf,
  ): void {
    const cardPadding = 12;
    const innerWidth = CONTENT_WIDTH - 2 * cardPadding;
    const rankCellWidth = innerWidth / 5;
    const rowHeight = 28;
    const ranks: (keyof VoteDistributionForPdf)[] = ['S', 'A', 'B', 'C', 'D'];

    let y = doc.y;

    doc
      .roundedRect(
        MARGIN,
        y,
        CONTENT_WIDTH,
        rowHeight + 2 * cardPadding + 24,
        4,
      )
      .fillAndStroke('#F1F5F9', '#E2E8F0');
    y += cardPadding;

    doc.fillColor('#0F172A').fontSize(14).font('Helvetica-Bold');
    doc.text(companyName, MARGIN + cardPadding, y);
    y += 22;

    doc.fontSize(10).font('Helvetica').fillColor('#64748B');
    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      const x = MARGIN + cardPadding + i * rankCellWidth;
      const cellW = rankCellWidth;
      doc
        .fillColor(RANK_COLORS[rank] ?? RANK_COLORS.default)
        .rect(x, y, cellW, rowHeight)
        .fill();
      doc.fillColor('#0F172A').font('Helvetica-Bold');
      doc.text(rank, x + cellW / 2 - 4, y + 8);
      doc.font('Helvetica').fillColor('#1E293B');
      doc.text(`${voteDistribution[rank]} vote(s)`, x, y + 18, {
        width: cellW,
        align: 'center',
      });
    }
    doc.y = y + rowHeight + cardPadding + 14;
    doc.fillColor('#334155');
  }

  private drawFooter(doc: PdfDoc): void {
    const pageHeight = 842;
    doc.fontSize(9).font('Helvetica').fillColor('#94A3B8');
    doc.text('Rapport mutualisé — TierListes', MARGIN, pageHeight - 30, {
      align: 'left',
    });
    doc.fillColor('#334155');
  }

  async generateFullReportPdf(items: CompanyStatsForPdf[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: MARGIN, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      this.drawHeader(doc);

      if (items.length === 0) {
        doc.fontSize(14).font('Helvetica').fillColor('#64748B');
        doc.text('Aucune entreprise enregistrée.', MARGIN, doc.y);
        doc.fillColor('#334155');
      } else {
        doc.fontSize(12).font('Helvetica').fillColor('#64748B');
        doc.text(`Toutes les entreprises (${items.length})`, MARGIN, doc.y);
        doc.moveDown(1);
        doc.fillColor('#334155');

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          this.drawCompanyCard(doc, item.companyName, item.voteDistribution);
          if (doc.y > 750) {
            doc.addPage();
            doc.y = MARGIN;
          }
        }
      }

      this.drawFooter(doc);
      doc.end();
    });
  }
}
