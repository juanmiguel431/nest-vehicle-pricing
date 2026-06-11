import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dtos/user.dto';
import { SignInDto } from '../users/dtos/sign-in.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  private authService: AuthService;
  private userService: UsersService;

  constructor(authService: AuthService, userService: UsersService) {
    this.authService = authService;
    this.userService = userService;
  }

  @Post('sign-up')
  async signUp(
    @Body() body: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.authService.signUp(body.email, body.password);

    session.userId = user.id;

    return UserDto.fromUser(user);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() body: SignInDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const user = await this.authService.signIn(body.email, body.password);
      session.userId = user.id;

      return UserDto.fromUser(user);
    } catch (error) {
      throw new BadRequestException('Invalid Credentials');
    }
  }

  @Get('me')
  async me(@Session() session: Record<string, any>) {
    console.log(session);

    if (!session.userId) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userService.findById(session.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserDto.fromUser(user);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@Session() session: Record<string, any>) {
    console.log(session);

    if (!session.userId) {
      throw new NotFoundException('User not found');
    }

    session.userId = null;
  }

  @Post('colors/:color')
  @HttpCode(HttpStatus.OK)
  async setColor(
    @Param('color') color: string,
    @Session() session: Record<string, any>,
  ) {
    session.color = color;
  }

  @Get('colors')
  async getColors(@Session() session: Record<string, any>) {
    return session.color;
  }
}
