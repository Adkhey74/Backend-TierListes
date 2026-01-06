import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import {
  UserRepositoryPort,
  USER_REPOSITORY,
} from '../../../domain/ports/repositories/user.repository.port';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
