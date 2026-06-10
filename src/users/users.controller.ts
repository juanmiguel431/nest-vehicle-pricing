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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  private service: UsersService;

  constructor(service: UsersService) {
    this.service = service;
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserDto(user);
  }

  @Get()
  async findAll(@Query('email') email?: string) {
    if (email) {
      const users = await this.service.find({ where: { email } });
      return users.map((user) => new UserDto(user));
    }

    const users = await this.service.find();
    return users.map((user) => new UserDto(user));
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
