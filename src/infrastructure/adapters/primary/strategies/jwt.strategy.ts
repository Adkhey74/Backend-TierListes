import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UserRepositoryPort,
  USER_REPOSITORY,
} from '../../../../domain/ports/repositories/user.repository.port';
import { TokenPayload } from '../../../../domain/ports/services/auth.service.port';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req?.cookies?.accessToken,
      ]),
      secretOrKey: secret,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}
