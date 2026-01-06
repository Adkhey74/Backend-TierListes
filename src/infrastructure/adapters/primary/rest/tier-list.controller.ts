import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../decorators/current-user.decorator';
import {
  CreateTierListUseCase,
  GetUserTierListsUseCase,
  GetTierListByIdUseCase,
  AddItemToTierListUseCase,
} from '../../../../application/uses-cases/tier-list';
import { ProcessPaymentUseCase } from '../../../../application/uses-cases/payment';
import {
  CalculateMutualizedUseCase,
  GetAllMutualizedUseCase,
} from '../../../../application/uses-cases/mutualized';
import {
  CreateTierListDto,
  AddItemDto,
  TierListResponseDto,
  ProcessPaymentDto,
  PaymentResponseDto,
  MutualizedTierListResponseDto,
} from '../dto/tier-list.dto';

@ApiTags('tier-lists')
@Controller('tier-lists')
export class TierListController {
  constructor(
    private readonly createTierListUseCase: CreateTierListUseCase,
    private readonly getUserTierListsUseCase: GetUserTierListsUseCase,
    private readonly getTierListByIdUseCase: GetTierListByIdUseCase,
    private readonly addItemUseCase: AddItemToTierListUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly calculateMutualizedUseCase: CalculateMutualizedUseCase,
    private readonly getAllMutualizedUseCase: GetAllMutualizedUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une nouvelle TierList' })
  @ApiResponse({ status: 201, type: TierListResponseDto })
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateTierListDto,
  ): Promise<TierListResponseDto> {
    const tierList = await this.createTierListUseCase.execute({
      userId: user.id,
      title: dto.title,
    });

    return this.toResponseDto(tierList);
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

  @Post(':id/items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un item à une TierList' })
  @ApiResponse({ status: 201 })
  async addItem(
    @Param('id') tierListId: string,
    @Body() dto: AddItemDto,
  ) {
    const item = await this.addItemUseCase.execute({
      tierListId,
      logoId: dto.logoId,
      categoryRank: dto.category,
    });

    return {
      id: item.id,
      tierListId: item.tierListId,
      logoId: item.logoId,
      category: item.category.rank,
    };
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
  @Get('mutualized/all')
  @ApiOperation({ summary: 'Récupérer tous les classements mutualisés' })
  @ApiResponse({ status: 200, type: [MutualizedTierListResponseDto] })
  async getAllMutualized(): Promise<MutualizedTierListResponseDto[]> {
    const mutualizedList = await this.getAllMutualizedUseCase.execute();

    return mutualizedList.map((m) => ({
      id: m.id,
      logoId: m.logoId,
      averageScore: m.averageScore,
      finalRank: m.finalRank.rank,
      voteDistribution: m.voteDistribution.toJSON(),
      pdfUrl: m.pdfUrl,
      lastCalculatedAt: m.lastCalculatedAt,
    }));
  }

  @Post('mutualized/calculate/:logoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Recalculer le classement mutualisé pour un logo' })
  @ApiResponse({ status: 200, type: MutualizedTierListResponseDto })
  async calculateMutualized(
    @Param('logoId') logoId: string,
  ): Promise<MutualizedTierListResponseDto> {
    const mutualized = await this.calculateMutualizedUseCase.execute(logoId);

    return {
      id: mutualized.id,
      logoId: mutualized.logoId,
      averageScore: mutualized.averageScore,
      finalRank: mutualized.finalRank.rank,
      voteDistribution: mutualized.voteDistribution.toJSON(),
      pdfUrl: mutualized.pdfUrl,
      lastCalculatedAt: mutualized.lastCalculatedAt,
    };
  }

  private toResponseDto(tierList: any): TierListResponseDto {
    return {
      id: tierList.id,
      userId: tierList.userId,
      title: tierList.title,
      status: tierList.status,
      items: tierList.items.map((item: any) => ({
        id: item.id,
        tierListId: item.tierListId,
        logoId: item.logoId,
        category: item.category.rank,
      })),
      createdAt: tierList.createdAt,
      updatedAt: tierList.updatedAt,
    };
  }
}
