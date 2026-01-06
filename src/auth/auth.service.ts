import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/adapter/user.service';
import { Role } from 'generated/prisma/enums';
import { User } from 'src/user/domain/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const isExisting = await this.userService.findByEmail(dto.email);
    if (isExisting) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.persist({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: hash,
      role: Role.USER,
    });

    return { user };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;
    const { ...result } = user;
    return result;
  }

  login(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
