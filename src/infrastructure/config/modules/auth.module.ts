import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from '../../adapters/primary/rest/auth.controller';
import { JwtAuthService } from '../../adapters/secondary/services/jwt-auth.service';
import { LocalStrategy } from '../../adapters/primary/strategies/local.strategy';
import { JwtStrategy } from '../../adapters/primary/strategies/jwt.strategy';

import { AUTH_SERVICE } from '../../../domain/ports/services/auth.service.port';
import { USER_REPOSITORY } from '../../../domain/ports/repositories/user.repository.port';

import {
  RegisterUserUseCase,
  ValidateUserUseCase,
  LoginUserUseCase,
} from '../../../application/uses-cases/auth';
import { FindUserByIdUseCase } from '../../../application/uses-cases/user';

import { PrismaUserRepository } from '../../adapters/secondary/repositories/prisma-user.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    // Services
    {
      provide: AUTH_SERVICE,
      useClass: JwtAuthService,
    },
    // Strategies
    LocalStrategy,
    JwtStrategy,
    // Use Cases
    RegisterUserUseCase,
    ValidateUserUseCase,
    LoginUserUseCase,
    FindUserByIdUseCase,
  ],
  exports: [AUTH_SERVICE, JwtModule],
})
export class AuthModule {}
