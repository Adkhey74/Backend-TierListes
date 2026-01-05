import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './adapter/company.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
})
export class CompanyModule {}
