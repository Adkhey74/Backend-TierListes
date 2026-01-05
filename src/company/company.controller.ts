import { Body, Controller, Post } from '@nestjs/common';
import { CompanyService } from './adapter/company.service';
import { Company } from './domain/company';
import { AddCompanyDto } from './dto/add-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async persist(@Body() dto: AddCompanyDto): Promise<Company> {
    console.log('company controller: ', dto);
    return this.companyService.persist(dto);
  }
}
