import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, IsUUID } from 'class-validator';

export class CreateTierListDto {
  @ApiProperty({ example: 'Ma TierList Tech 2024' })
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  title: string;
}

export class AddItemDto {
  @ApiProperty({ example: 'uuid-du-logo' })
  @IsUUID()
  @IsNotEmpty({ message: 'Le logoId est requis' })
  logoId: string;

  @ApiProperty({ enum: ['S', 'A', 'B', 'C', 'D'], example: 'A' })
  @IsIn(['S', 'A', 'B', 'C', 'D'], {
    message: 'La catégorie doit être S, A, B, C ou D',
  })
  @IsNotEmpty({ message: 'La catégorie est requise' })
  category: 'S' | 'A' | 'B' | 'C' | 'D';
}

export class TierListItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tierListId: string;

  @ApiProperty()
  logoId: string;

  @ApiProperty()
  category: string;
}

export class TierListResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: ['PENDING_PAYMENT', 'PAID'] })
  status: string;

  @ApiProperty({ type: [TierListItemResponseDto] })
  items: TierListItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ProcessPaymentDto {
  @ApiProperty({ example: 9.99 })
  @IsNotEmpty({ message: 'Le montant est requis' })
  amount: number;
}

export class PaymentResponseDto {
  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  clientSecret: string;

  @ApiProperty()
  status: string;
}

export class MutualizedTierListResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  logoId: string;

  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  finalRank: string;

  @ApiProperty()
  voteDistribution: {
    S: number;
    A: number;
    B: number;
    C: number;
    D: number;
  };

  @ApiPropertyOptional()
  pdfUrl?: string;

  @ApiProperty()
  lastCalculatedAt: Date;
}

