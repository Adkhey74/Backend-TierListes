import { Module } from '@nestjs/common';
import { UserController } from '../../adapters/primary/rest/user.controller';
import { PrismaUserRepository } from '../../adapters/secondary/repositories/prisma-user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { USER_REPOSITORY } from '../../../domain/ports/repositories/user.repository.port';
import {
  CreateUserUseCase,
  FindUserByIdUseCase,
  FindUserByEmailUseCase,
  GetAllUsersUseCase,
} from '../../../application/uses-cases/user';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    GetAllUsersUseCase,
  ],
  exports: [
    USER_REPOSITORY,
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    GetAllUsersUseCase,
  ],
})
export class UserModule {}
