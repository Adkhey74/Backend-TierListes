import { User } from './user';

export interface UserDatasourcePort {
  all(): Promise<User[]>;
  byId(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  persist(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
