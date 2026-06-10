import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  private service: UsersService;

  constructor(service: UsersService) {
    this.service = service;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query('email') email?: string) {
    if (email) {
      return this.service.find({ where: { email } });
    }

    return this.service.find();
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.service.remove(user);
  }

  @Patch(':id')
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    const user = await this.service.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.service.update(user, body);
  }
}
