import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dtos/user.dto';

@Controller('auth')
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signUp(body.email, body.password);
    return UserDto.fromUser(user);
  }
}
