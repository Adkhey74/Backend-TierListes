import { Company } from './company';

export interface CompanyDatasourcePort {
  all(): Promise<Company[]>;
  byId(id: number): Promise<Company | null>;
  persist(company: Company): Promise<Company>;
  delete(id: number): Promise<void>;
  update(company: Company): Promise<Company>;
}
