import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../decorators/current-user.decorator';
import {
  CreateTierListUseCase,
  GetUserTierListsUseCase,
  GetTierListByIdUseCase,
  SaveItemsToTierListUseCase,
} from '../../../../application/uses-cases/tier-list';
import { ProcessPaymentUseCase } from '../../../../application/uses-cases/payment';
import {
  CreateMutualizedUseCase,
  UpdateMutualizedUseCase,
  DownloadMutualizedPdfUseCase,
  GetAllMutualizedUseCase,
} from '../../../../application/uses-cases/mutualized';
import {
  CreateTierListDto,
  TierListResponseDto,
  ProcessPaymentDto,
  PaymentResponseDto,
  MutualizedTierListResponseDto,
  SaveItemsToTierListDto,
  CreateMutualizedDto,
  UpdateMutualizedDto,
} from '../dto/tier-list.dto';
import { TierList } from '../../../../domain/entities/tier-list.entity';
import { TierListItem } from '../../../../domain/entities/tier-list-item.entity';
import { DeleteTierListUseCase } from 'src/application/uses-cases/tier-list/delete-tier-list.usecase';

@ApiTags('tier-lists')
@Controller('tier-lists')
export class TierListController {
  constructor(
    private readonly createTierListUseCase: CreateTierListUseCase,
    private readonly getUserTierListsUseCase: GetUserTierListsUseCase,
    private readonly getTierListByIdUseCase: GetTierListByIdUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly createMutualizedUseCase: CreateMutualizedUseCase,
    private readonly updateMutualizedUseCase: UpdateMutualizedUseCase,
    private readonly downloadMutualizedPdfUseCase: DownloadMutualizedPdfUseCase,
    private readonly getAllMutualizedUseCase: GetAllMutualizedUseCase,
    private readonly saveItemsToTierListUseCase: SaveItemsToTierListUseCase,
    private readonly deleteTierListUseCase: DeleteTierListUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Créer une nouvelle TierList (avec items optionnels)',
  })
  @ApiResponse({ status: 201, type: TierListResponseDto })
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateTierListDto,
  ): Promise<TierListResponseDto> {
    const { title, items } = dto;
    const tierList = await this.createTierListUseCase.execute({
      userId: user.id,
      title,
      items,
    });

    const hasItems = (tierList.items?.length ?? 0) > 0;
    return this.toResponseDto(tierList, hasItems);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer mes TierLists' })
  @ApiResponse({ status: 200, type: [TierListResponseDto] })
  async getMyTierLists(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<TierListResponseDto[]> {
    const tierLists = await this.getUserTierListsUseCase.execute(user.id);
    return tierLists.map((tl) => this.toResponseDto(tl));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une TierList par ID' })
  @ApiResponse({ status: 200, type: TierListResponseDto })
  async getById(@Param('id') id: string): Promise<TierListResponseDto | null> {
    const tierList = await this.getTierListByIdUseCase.execute(id);
    return tierList ? this.toResponseDto(tierList) : null;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une TierList par ID' })
  @ApiResponse({ status: 200, description: 'TierList supprimée avec succès' })
  async delete(@Param('id') id: string): Promise<{ success: true }> {
    await this.deleteTierListUseCase.execute(id);
    return { success: true };
  }

  @Post(':id/save-items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Sauvegarder les items d'une TierList" })
  @ApiResponse({ status: 201, type: TierListResponseDto })
  @ApiResponse({ status: 400, description: 'Plus de 10 items' })
  @ApiResponse({ status: 404, description: 'TierList non trouvée' })
  async saveItems(
    @Param('id') tierListId: string,
    @Body() dto: SaveItemsToTierListDto,
  ): Promise<TierListResponseDto> {
    await this.saveItemsToTierListUseCase.execute(dto, tierListId);
    const tierList = await this.getTierListByIdUseCase.execute(tierListId);
    return this.toResponseDto(tierList!);
  }

  @Post(':id/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initier le paiement pour une TierList' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
  async pay(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') tierListId: string,
    @Body() dto: ProcessPaymentDto,
  ): Promise<PaymentResponseDto> {
    const result = await this.processPaymentUseCase.execute({
      userId: user.id,
      tierListId,
      amount: dto.amount,
    });

    return {
      paymentId: result.payment.id,
      clientSecret: result.clientSecret,
      status: result.payment.status,
    };
  }

  // Endpoints Mutualized
  @Post('mutualized')
  @ApiOperation({ summary: 'Créer une entrée mutualisée (company + catégorie + nombre de votes)' })
  @ApiResponse({ status: 201, description: 'Entrée mutualisée créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async createMutualized(
    @Body() dto: CreateMutualizedDto,
  ): Promise<MutualizedTierListResponseDto> {
    const m = await this.createMutualizedUseCase.execute({
      companyId: dto.companyId,
      category: dto.category as 'S' | 'A' | 'B' | 'C' | 'D',
      numberOfVotes: dto.numberOfVotes,
    });
    return {
      companyId: m.companyId,
      category: m.category,
      numberOfVotes: m.numberOfVotes,
      createdAt: m.createdAt ?? new Date(),
      updatedAt: m.updatedAt ?? new Date(),
    };
  }

  @Put('mutualized')
  @ApiOperation({ summary: 'Mettre à jour le nombre de votes d’une entrée mutualisée' })
  @ApiResponse({ status: 200, description: 'Entrée mutualisée mise à jour' })
  async updateMutualized(
    @Body() dto: UpdateMutualizedDto,
  ): Promise<MutualizedTierListResponseDto> {
    const m = await this.updateMutualizedUseCase.execute({
      companyId: dto.companyId,
      category: dto.category as 'S' | 'A' | 'B' | 'C' | 'D',
      numberOfVotes: dto.numberOfVotes,
    });
    return {
      companyId: m.companyId,
      category: m.category,
      numberOfVotes: m.numberOfVotes,
      createdAt: m.createdAt ?? new Date(),
      updatedAt: m.updatedAt ?? new Date(),
    };
  }

  @Get('mutualized/pdf/download')
  @ApiOperation({
    summary: 'Télécharger le PDF rapport mutualisé (toutes les entreprises)',
  })
  @ApiResponse({ status: 200, description: 'Fichier PDF en téléchargement' })
  async downloadMutualizedPdf(): Promise<StreamableFile> {
    const buffer = await this.downloadMutualizedPdfUseCase.execute();
    return new StreamableFile(buffer, {
      type: 'application/pdf',
      disposition:
        'attachment; filename="rapport-mutualized-toutes-entreprises.pdf"',
    });
  }

  @Get('mutualized/all')
  @ApiOperation({ summary: 'Récupérer tous les classements mutualisés' })
  @ApiResponse({ status: 200, type: [MutualizedTierListResponseDto] })
  async getAllMutualized(): Promise<MutualizedTierListResponseDto[]> {
    const mutualizedList = await this.getAllMutualizedUseCase.execute();

    return mutualizedList.map((m) => ({
      companyId: m.companyId,
      category: m.category,
      numberOfVotes: m.numberOfVotes,
      createdAt: m.createdAt ?? new Date(),
      updatedAt: m.updatedAt ?? new Date(),
    }));
  }

  private toResponseDto(
    tierList: TierList,
    withItems = false,
  ): TierListResponseDto {
    if (withItems) {
      return {
        id: tierList.id,
        userId: tierList.userId,
        title: tierList.title,
        status: tierList.status,
        items: tierList.items.map((item: TierListItem) => ({
          id: item.id,
          tierListId: item.tierListId,
          logoId: item.logoId,
          category: item.category.rank,
        })),
        createdAt: tierList.createdAt,
        updatedAt: tierList.updatedAt,
      };
    }
    return {
      id: tierList.id,
      userId: tierList.userId,
      title: tierList.title,
      status: tierList.status,
      createdAt: tierList.createdAt,
      updatedAt: tierList.updatedAt,
    };
  }
}
