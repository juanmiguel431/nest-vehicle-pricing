import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {

  @Post('signup')
  signup(@Body() body: CreateUserDto) {

    console.log(body);
  }
}
