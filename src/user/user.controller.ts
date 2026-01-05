import { Controller, Get } from '@nestjs/common';
import { UserService } from './adapter/user.service';
import { User } from './domain/user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async all(): Promise<User[]> {
    return this.userService.all();
  }
}
