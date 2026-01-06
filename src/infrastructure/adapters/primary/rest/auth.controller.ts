import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Res,
  Request,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User } from '../../../../domain/entities/user.entity';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
} from '../../../../application/uses-cases/auth';
import { FindUserByIdUseCase } from '../../../../application/uses-cases/user';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../decorators/current-user.decorator';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { UserResponseDto } from '../dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  private getCookieOptions() {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      maxAge: 86400000, // 24 heures
      path: '/',
      domain: process.env.COOKIE_DOMAIN,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect' })
  async login(
    @Request() req: { user: User },
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto | null> {
    const { access_token } = this.loginUserUseCase.execute(req.user);

    res.cookie('accessToken', access_token, this.getCookieOptions());

    const user = await this.findUserByIdUseCase.execute(req.user.id);
    return user ? (user.toSafeObject() as UserResponseDto) : null;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Déconnexion utilisateur' })
  @ApiResponse({ status: 200, description: 'Déconnecté avec succès' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return { message: 'Déconnecté avec succès' };
  }

  @Post('register')
  @ApiOperation({ summary: 'Inscription utilisateur' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Email déjà utilisé' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto | null> {
    const newUser = await this.registerUserUseCase.execute(dto);

    const { access_token } = this.loginUserUseCase.execute(newUser);

    res.cookie('accessToken', access_token, this.getCookieOptions());

    const user = await this.findUserByIdUseCase.execute(newUser.id);
    return user ? (user.toSafeObject() as UserResponseDto) : null;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Récupérer utilisateur connecté' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async me(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<UserResponseDto | null> {
    const user = await this.findUserByIdUseCase.execute(currentUser.id);
    return user ? (user.toSafeObject() as UserResponseDto) : null;
  }
}
