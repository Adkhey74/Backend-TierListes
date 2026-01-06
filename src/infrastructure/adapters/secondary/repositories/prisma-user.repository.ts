import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, Role } from '../../../../domain/entities/user.entity';
import {
  UserRepositoryPort,
  CreateUserData,
} from '../../../../domain/ports/repositories/user.repository.port';
import { Role as PrismaRole } from 'generated/prisma/enums';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(prismaUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: PrismaRole;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.create({
      id: prismaUser.id,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      email: prismaUser.email,
      password: prismaUser.password,
      role: prismaUser.role as Role,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.toDomain(user));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return this.toDomain(user);
  }

  async create(data: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role as PrismaRole,
      },
    });

    return this.toDomain(user);
  }

  async update(id: string, data: Partial<CreateUserData>): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.password && { password: data.password }),
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.role && { role: data.role as PrismaRole }),
      },
    });

    return this.toDomain(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
