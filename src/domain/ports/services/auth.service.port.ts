import { User } from '../../entities/user.entity';

export interface TokenPayload {
  id: string;
  email: string;
}

export interface AuthTokens {
  access_token: string;
}

export interface AuthServicePort {
  generateToken(user: User): AuthTokens;
  validateToken(token: string): TokenPayload | null;
  hashPassword(password: string): Promise<string>;
  comparePasswords(password: string, hashedPassword: string): Promise<boolean>;
}

export const AUTH_SERVICE = Symbol('AUTH_SERVICE');
