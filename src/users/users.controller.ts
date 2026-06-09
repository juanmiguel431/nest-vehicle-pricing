import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private service: UsersService;

  constructor(service: UsersService) {
    this.service = service;
  }

  @Get(':id')
  async find(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  findAll(@Query('email') email?: string) {
    if (email) {
      return this.service.findByEmail(email);
    }

    return this.service.find();
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.service.remove(user);
  }
}
