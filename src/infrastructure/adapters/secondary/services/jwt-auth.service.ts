import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../../../domain/entities/user.entity';
import {
  AuthServicePort,
  AuthTokens,
  TokenPayload,
} from '../../../../domain/ports/services/auth.service.port';

@Injectable()
export class JwtAuthService implements AuthServicePort {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User): AuthTokens {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validateToken(token: string): TokenPayload | null {
    try {
      return this.jwtService.verify<TokenPayload>(token);
    } catch {
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
