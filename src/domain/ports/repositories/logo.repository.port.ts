import { Logo } from '../../entities/logo.entity';

export interface CreateLogoData {
  name: string;
}

export interface LogoRepositoryPort {
  findAll(): Promise<Logo[]>;
  findById(id: string): Promise<Logo | null>;
  findByName(name: string): Promise<Logo | null>;
  create(data: CreateLogoData): Promise<Logo>;
  update(id: string, data: Partial<CreateLogoData>): Promise<Logo>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}

export const LOGO_REPOSITORY = Symbol('LOGO_REPOSITORY');
