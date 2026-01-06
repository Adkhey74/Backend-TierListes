import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { User, Role } from '../../../domain/entities/user.entity';
import {
  UserRepositoryPort,
  USER_REPOSITORY,
} from '../../../domain/ports/repositories/user.repository.port';
import {
  AuthServicePort,
  AUTH_SERVICE,
} from '../../../domain/ports/services/auth.service.port';

export interface RegisterUserCommand {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    const hashedPassword = await this.authService.hashPassword(
      command.password,
    );

    return this.userRepository.create({
      email: command.email,
      password: hashedPassword,
      firstName: command.firstName,
      lastName: command.lastName,
      role: Role.USER,
    });
  }
}
