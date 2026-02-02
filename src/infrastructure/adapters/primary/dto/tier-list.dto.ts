import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';

export class TierListItemDto {
  @ApiPropertyOptional({ description: "ID de l'item (généré si absent)" })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'ID du logo (Company)' })
  @IsString()
  @IsNotEmpty({ message: 'logoId est requis' })
  logoId: string;

  @ApiProperty({
    enum: ['S', 'A', 'B', 'C', 'D'],
    description: "Catégorie de l'item",
  })
  @IsString()
  @IsIn(['S', 'A', 'B', 'C', 'D'], {
    message: 'category doit être S, A, B, C ou D',
  })
  category: string;
}

export class CreateTierListDto {
  @ApiProperty({ example: 'Ma TierList Tech 2024' })
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  title: string;

  @ApiPropertyOptional({
    type: [TierListItemDto],
    maxItems: 10,
    description: 'Items optionnels à sauvegarder à la création',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, {
    message: 'Une TierList ne peut pas contenir plus de 10 items',
  })
  @ValidateNested({ each: true })
  items?: TierListItemDto[];
}

export class SaveItemsToTierListDto {
  @ApiProperty({ type: [TierListItemDto], maxItems: 10 })
  @IsArray()
  @ArrayMaxSize(10, {
    message: 'Une TierList ne peut pas contenir plus de 10 items',
  })
  @ValidateNested({ each: true })
  items: TierListItemDto[];
}

export class TierListItemsResponseDto {
  @ApiProperty()
  id: string;

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

  @ApiProperty({ type: [TierListItemsResponseDto] })
  items?: TierListItemsResponseDto[];

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

export class CreateMutualizedDto {
  @ApiProperty({ description: "ID de l'entreprise (Company)" })
  @IsString()
  @IsNotEmpty({ message: 'companyId est requis' })
  companyId: string;

  @ApiProperty({
    enum: ['S', 'A', 'B', 'C', 'D'],
    description: 'Catégorie du classement mutualisé',
  })
  @IsString()
  @IsIn(['S', 'A', 'B', 'C', 'D'], {
    message: 'category doit être S, A, B, C ou D',
  })
  category: string;

  @ApiProperty({ description: 'Nombre de votes pour cette catégorie' })
  @IsInt()
  @Min(0)
  numberOfVotes: number;
}

export class UpdateMutualizedDto {
  @ApiProperty({ description: "ID de l'entreprise (Company)" })
  @IsString()
  @IsNotEmpty({ message: 'companyId est requis' })
  companyId: string;

  @ApiProperty({
    enum: ['S', 'A', 'B', 'C', 'D'],
    description: 'Catégorie du classement mutualisé',
  })
  @IsString()
  @IsIn(['S', 'A', 'B', 'C', 'D'], {
    message: 'category doit être S, A, B, C ou D',
  })
  category: string;

  @ApiProperty({ description: 'Nouveau nombre de votes' })
  @IsInt()
  @Min(0)
  numberOfVotes: number;
}

export class MutualizedTierListResponseDto {
  @ApiProperty()
  companyId: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  numberOfVotes: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
