import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from 'src/user/adapter/user.service';
import { User } from 'src/user/domain/user';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  private getCookieOptions() {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      maxAge: 86400000,
      path: '/',
      domain: process.env.COOKIE_DOMAIN,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() req: { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = this.authService.login(req.user);

    res.cookie('accessToken', access_token, this.getCookieOptions());
    return this.userService.byId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return { message: 'Déconnecté avec succès' };
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user: newUser } = await this.authService.register(dto);

    const { access_token } = this.authService.login(newUser);

    res.cookie('accessToken', access_token, this.getCookieOptions());
    return this.userService.byId(newUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: User) {
    return this.userService.byId(user.id);
  }
}
