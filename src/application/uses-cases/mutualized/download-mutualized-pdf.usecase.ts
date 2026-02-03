import { Inject, Injectable } from '@nestjs/common';
import {
  PdfGeneratorPort,
  PDF_GENERATOR,
} from '../../../domain/ports/services/pdf-generator.port';
import { STORAGE_SERVICE } from '../../../domain/ports/services/storage.service.port';
import type { StorageServicePort } from '../../../domain/ports/services/storage.service.port';
import { MUTUALIZED_TIER_LIST_REPOSITORY } from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';
import type { MutualizedTierListRepositoryPort } from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';

const MUTUALIZED_PDF_KEY = 'rapports/rapport-mutualized.pdf';

/**
 * Retourne le PDF rapport mutualisé stocké dans MinIO.
 * Si le fichier n'existe pas encore, le génère, l'enregistre dans MinIO et le retourne.
 */
@Injectable()
export class DownloadMutualizedPdfUseCase {
  constructor(
    @Inject(PDF_GENERATOR)
    private readonly pdfGenerator: PdfGeneratorPort,
    @Inject(MUTUALIZED_TIER_LIST_REPOSITORY)
    private readonly mutualizedRepository: MutualizedTierListRepositoryPort,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageServicePort,
  ) {}

  async execute(): Promise<Buffer> {
    try {
      return await this.storageService.getFile(MUTUALIZED_PDF_KEY);
    } catch {
      // Fichier absent ou erreur : on génère, on stocke, on retourne
    }

    const items =
      await this.mutualizedRepository.findAllCompaniesWithVoteDistribution();
    const buffer = await this.pdfGenerator.generateFullReportPdf(items);

    await this.storageService.uploadFile(
      {
        buffer,
        originalname: 'rapport-mutualized-toutes-entreprises.pdf',
        mimetype: 'application/pdf',
        size: buffer.length,
      },
      MUTUALIZED_PDF_KEY,
    );

    return buffer;
  }
}
