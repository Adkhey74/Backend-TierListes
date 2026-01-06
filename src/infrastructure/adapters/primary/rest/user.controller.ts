import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  GetAllUsersUseCase,
  FindUserByIdUseCase,
  CreateUserUseCase,
} from '../../../../application/uses-cases/user';
import { CreateUserDto, UserResponseDto } from '../dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.getAllUsersUseCase.execute();
    return users.map((user) => user.toSafeObject() as UserResponseDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findById(@Param('id') id: string): Promise<UserResponseDto | null> {
    const user = await this.findUserByIdUseCase.execute(id);
    return user ? (user.toSafeObject() as UserResponseDto) : null;
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Email déjà utilisé' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(dto);
    return user.toSafeObject() as UserResponseDto;
  }
}
