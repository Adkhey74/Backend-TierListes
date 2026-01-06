import { Inject, Injectable } from '@nestjs/common';
import { TierList } from '../../../domain/entities/tier-list.entity';
import {
  TierListRepositoryPort,
  TIER_LIST_REPOSITORY,
} from '../../../domain/ports/repositories/tier-list.repository.port';

export interface CreateTierListCommand {
  userId: string;
  title: string;
}

@Injectable()
export class CreateTierListUseCase {
  constructor(
    @Inject(TIER_LIST_REPOSITORY)
    private readonly tierListRepository: TierListRepositoryPort,
  ) {}

  async execute(command: CreateTierListCommand): Promise<TierList> {
    return this.tierListRepository.create({
      userId: command.userId,
      title: command.title,
    });
  }
}
