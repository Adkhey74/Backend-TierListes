import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MutualizedTierList } from '../../../domain/entities/mutualized-tier-list.entity';
import {
  MutualizedTierListRepositoryPort,
  MUTUALIZED_TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';
import {
  PdfGeneratorPort,
  PDF_GENERATOR,
} from '../../../domain/ports/services/pdf-generator.port';
import {
  StorageServicePort,
  STORAGE_SERVICE,
} from '../../../domain/ports/services/storage.service.port';

@Injectable()
export class GeneratePdfUseCase {
  constructor(
    @Inject(MUTUALIZED_TIER_LIST_REPOSITORY)
    private readonly mutualizedRepository: MutualizedTierListRepositoryPort,
    @Inject(PDF_GENERATOR)
    private readonly pdfGenerator: PdfGeneratorPort,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageServicePort,
  ) {}

  async execute(mutualizedId: string): Promise<MutualizedTierList> {
    const mutualized = await this.mutualizedRepository.findById(mutualizedId);

    if (!mutualized) {
      throw new NotFoundException('MutualizedTierList non trouvée');
    }

    // Générer le PDF
    const pdfBuffer = await this.pdfGenerator.generateMutualizedTierListPdf(
      mutualized,
    );

    // Upload le PDF vers le storage
    const fileName = `mutualized-${mutualizedId}-${Date.now()}.pdf`;
    await this.storageService.uploadFile(
      {
        buffer: pdfBuffer,
        originalname: fileName,
        mimetype: 'application/pdf',
        size: pdfBuffer.length,
      },
      fileName,
    );

    // Récupérer l'URL du PDF
    const pdfUrl = await this.storageService.getFileUrl(fileName);

    // Mettre à jour le MutualizedTierList avec l'URL du PDF
    return this.mutualizedRepository.updatePdfUrl(mutualizedId, pdfUrl);
  }
}
