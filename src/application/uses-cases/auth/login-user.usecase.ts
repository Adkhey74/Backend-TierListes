import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import {
  AuthServicePort,
  AUTH_SERVICE,
  AuthTokens,
} from '../../../domain/ports/services/auth.service.port';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServicePort,
  ) {}

  execute(user: User): AuthTokens {
    return this.authService.generateToken(user);
  }
}
