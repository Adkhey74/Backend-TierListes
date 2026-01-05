import { Injectable } from '@nestjs/common';
import { UserDatasourcePort } from '../domain/user-datasource.port';
import { User } from '../domain/user';

@Injectable()
export class UserService implements UserDatasourcePort {
  all(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  byId(id: number): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}
