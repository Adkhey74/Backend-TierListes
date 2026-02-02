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

  async execute(
    companyId: string,
    category: string,
  ): Promise<MutualizedTierList> {
    const mutualized = await this.mutualizedRepository.findByCompanyIdAndCategory(
      companyId,
      category,
    );

    if (!mutualized) {
      throw new NotFoundException('MutualizedTierList non trouvée');
    }

    const pdfBuffer = await this.pdfGenerator.generateMutualizedTierListPdf(
      mutualized,
    );

    const fileName = `mutualized-${companyId}-${category}-${Date.now()}.pdf`;
    await this.storageService.uploadFile(
      {
        buffer: pdfBuffer,
        originalname: fileName,
        mimetype: 'application/pdf',
        size: pdfBuffer.length,
      },
      fileName,
    );

    return mutualized;
  }
}
