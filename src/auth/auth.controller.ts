import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  private userService: UsersService;

  constructor(userService: UsersService) {
    this.userService = userService;
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {

    const result = await this.userService.create(body.email, body.password);
    console.log(body);
  }
}
