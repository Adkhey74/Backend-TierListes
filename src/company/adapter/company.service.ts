import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Company } from '../domain/company';
import { CompanyDatasourcePort } from '../domain/company-datasource.port';
import { PrismaService } from 'src/prisma.service';
import { AddCompanyDto } from '../dto/add-company.dto';

@Injectable()
export class CompanyService implements CompanyDatasourcePort {
  constructor(private readonly prisma: PrismaService) {}

  byId(id: number): Promise<Company | null> {
    throw new Error('Method not implemented.');
  }

  async persist(dto: AddCompanyDto): Promise<Company> {
    const nbExistingCompanies = await this.prisma.company.count();

    if (nbExistingCompanies >= 10) {
      throw new InternalServerErrorException('Only 10 companies are allowed');
    }

    const existingCompany = await this.prisma.company.findFirst({
      where: {
        name: dto.name.toUpperCase(),
      },
    });

    if (existingCompany) {
      throw new HttpException('Company already exists', 409);
    }
    const newCompany = await this.prisma.company.create({
      data: {
        name: dto.name.toUpperCase(),
      },
    });

    return new Company(
      newCompany.id,
      newCompany.name.toUpperCase(),
      newCompany.createdAt,
      newCompany.updatedAt,
    );
  }
  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  update(company: Company): Promise<Company> {
    throw new Error('Method not implemented.');
  }
  all(): Promise<Company[]> {
    throw new Error('Method not implemented.');
  }
}
