import { Module } from '@nestjs/common';
import { TierListController } from '../../adapters/primary/rest/tier-list.controller';

// Repositories
import { PrismaTierListRepository } from '../../adapters/secondary/repositories/prisma-tier-list.repository';
import { PrismaPaymentRepository } from '../../adapters/secondary/repositories/prisma-payment.repository';
import { PrismaMutualizedRepository } from '../../adapters/secondary/repositories/prisma-mutualized.repository';

// Services
import { StripePaymentService } from '../../adapters/secondary/services/stripe-payment.service';
import { PdfGeneratorService } from '../../adapters/secondary/services/pdf-generator.service';
import { MinioStorageService } from '../../adapters/secondary/services/minio-storage.service';
import { PrismaService } from '../../prisma/prisma.service';

// Ports
import { TIER_LIST_REPOSITORY } from '../../../domain/ports/repositories/tier-list.repository.port';
import { PAYMENT_REPOSITORY } from '../../../domain/ports/repositories/payment.repository.port';
import { MUTUALIZED_TIER_LIST_REPOSITORY } from '../../../domain/ports/repositories/mutualized-tier-list.repository.port';
import { PAYMENT_GATEWAY } from '../../../domain/ports/services/payment.gateway.port';
import { PDF_GENERATOR } from '../../../domain/ports/services/pdf-generator.port';
import { STORAGE_SERVICE } from '../../../domain/ports/services/storage.service.port';

// Use Cases - TierList
import {
  CreateTierListUseCase,
  DeleteTierListUseCase,
  GetUserTierListsUseCase,
  GetTierListByIdUseCase,
  SaveItemsToTierListUseCase,
  UpdateTierListUseCase,
} from '../../../application/uses-cases/tier-list';

// Use Cases - Payment
import { ProcessPaymentUseCase } from '../../../application/uses-cases/payment';

// Use Cases - Mutualized
import {
  CreateMutualizedUseCase,
  UpdateMutualizedUseCase,
  DownloadMutualizedPdfUseCase,
  GeneratePdfUseCase,
  GetAllMutualizedUseCase,
} from '../../../application/uses-cases/mutualized';

@Module({
  controllers: [TierListController],
  providers: [
    PrismaService,

    // Repositories
    {
      provide: TIER_LIST_REPOSITORY,
      useClass: PrismaTierListRepository,
    },
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: MUTUALIZED_TIER_LIST_REPOSITORY,
      useClass: PrismaMutualizedRepository,
    },

    // Services
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentService,
    },
    {
      provide: PDF_GENERATOR,
      useClass: PdfGeneratorService,
    },
    {
      provide: STORAGE_SERVICE,
      useClass: MinioStorageService,
    },

    // Use Cases
    CreateTierListUseCase,
    UpdateTierListUseCase,
    DeleteTierListUseCase,
    GetUserTierListsUseCase,
    GetTierListByIdUseCase,
    SaveItemsToTierListUseCase,
    ProcessPaymentUseCase,
    CreateMutualizedUseCase,
    UpdateMutualizedUseCase,
    DownloadMutualizedPdfUseCase,
    GeneratePdfUseCase,
    GetAllMutualizedUseCase,
  ],
  exports: [
    TIER_LIST_REPOSITORY,
    CreateTierListUseCase,
    GetUserTierListsUseCase,
  ],
})
export class TierListModule {}
