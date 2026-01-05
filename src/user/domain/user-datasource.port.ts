import { User } from './user';

export interface UserDatasourcePort {
  all(): Promise<User[]>;
  byId(id: number): Promise<User | null>;
}
