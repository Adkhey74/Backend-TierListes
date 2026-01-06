import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Logo } from '../../../../domain/entities/logo.entity';
import {
  LogoRepositoryPort,
  CreateLogoData,
} from '../../../../domain/ports/repositories/logo.repository.port';

@Injectable()
export class PrismaLogoRepository implements LogoRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(prismaCompany: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }): Logo {
    return Logo.create({
      id: prismaCompany.id,
      name: prismaCompany.name,
      createdAt: prismaCompany.createdAt,
      updatedAt: prismaCompany.updatedAt,
    });
  }

  async findAll(): Promise<Logo[]> {
    const companies = await this.prisma.company.findMany();
    return companies.map((company) => this.toDomain(company));
  }

  async findById(id: string): Promise<Logo | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) return null;

    return this.toDomain(company);
  }

  async findByName(name: string): Promise<Logo | null> {
    const company = await this.prisma.company.findFirst({
      where: { name: name.toUpperCase() },
    });

    if (!company) return null;

    return this.toDomain(company);
  }

  async create(data: CreateLogoData): Promise<Logo> {
    const company = await this.prisma.company.create({
      data: {
        name: data.name.toUpperCase(),
      },
    });

    return this.toDomain(company);
  }

  async update(id: string, data: Partial<CreateLogoData>): Promise<Logo> {
    const company = await this.prisma.company.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.toUpperCase() }),
      },
    });

    return this.toDomain(company);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return this.prisma.company.count();
  }
}
