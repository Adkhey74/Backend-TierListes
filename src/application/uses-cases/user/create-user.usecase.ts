import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { User, Role } from '../../../domain/entities/user.entity';
import {
  UserRepositoryPort,
  USER_REPOSITORY,
} from '../../../domain/ports/repositories/user.repository.port';
import * as bcrypt from 'bcrypt';

export interface CreateUserCommand {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(command.password, 10);

    return this.userRepository.create({
      email: command.email,
      password: hashedPassword,
      firstName: command.firstName,
      lastName: command.lastName,
      role: command.role ?? Role.USER,
    });
  }
}
