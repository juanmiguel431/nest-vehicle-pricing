import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dtos/user.dto';
import { SignInDto } from '../users/dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('sign-up')
  async signUp(@Body() body: CreateUserDto) {
    const user = await this.authService.signUp(body.email, body.password);
    return UserDto.fromUser(user);
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    try {
      const user = await this.authService.signIn(body.email, body.password);

      return UserDto.fromUser(user);
    } catch (error) {
      throw new BadRequestException('Invalid Credentials');
    }
  }
}
