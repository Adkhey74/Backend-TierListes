import { User, Role } from '../../entities/user.entity';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface UserRepositoryPort {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: Partial<CreateUserData>): Promise<User>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
