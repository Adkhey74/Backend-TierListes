import { Injectable } from '@nestjs/common';
import { UserDatasourcePort } from '../domain/user-datasource.port';
import { User } from '../domain/user';
import { PrismaService } from 'src/prisma.service';
import { AddUserDto } from '../dto/add-user.dto';

@Injectable()
export class UserService implements UserDatasourcePort {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return new User(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.role,
    );
  }
  async persist(dto: AddUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
      },
    });
    return new User(
      newUser.id,
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.password,
      newUser.role,
    );
  }
  update(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  all(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  async byId(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new User(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.role,
    );
  }
}
