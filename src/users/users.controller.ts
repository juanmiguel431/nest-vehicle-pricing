import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query, } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private service: UsersService;

  constructor(service: UsersService) {
    this.service = service;
  }

  @Get(':id')
  async find(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id);

    const user = await this.service.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  findAll(@Query('email') email: string | undefined) {
    if (email) {
      return this.service.findAll({ email });
    }

    return this.service.findAll();
  }
}
