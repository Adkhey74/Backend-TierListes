import { Inject, Injectable } from '@nestjs/common';
import {
  PdfGeneratorPort,
  PDF_GENERATOR,
} from '../../../domain/ports/services/pdf-generator.port';
import { MUTUALIZED_TIER_LIST_REPOSITORY } from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';
import type { MutualizedTierListRepositoryPort } from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';

/**
 * Génère un buffer PDF listant toutes les entreprises enregistrées en base
 * avec leurs statistiques de votes (répartition S, A, B, C, D).
 */
@Injectable()
export class DownloadMutualizedPdfUseCase {
  constructor(
    @Inject(PDF_GENERATOR)
    private readonly pdfGenerator: PdfGeneratorPort,
    @Inject(MUTUALIZED_TIER_LIST_REPOSITORY)
    private readonly mutualizedRepository: MutualizedTierListRepositoryPort,
  ) {}

  async execute(): Promise<Buffer> {
    const items =
      await this.mutualizedRepository.findAllCompaniesWithVoteDistribution();
    return this.pdfGenerator.generateFullReportPdf(items);
  }
}
