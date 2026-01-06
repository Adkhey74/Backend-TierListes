import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateUserUseCase } from '../../../../application/uses-cases/auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly validateUserUseCase: ValidateUserUseCase) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.validateUserUseCase.execute(email, password);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    return user;
  }
}

