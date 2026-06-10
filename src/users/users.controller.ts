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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import {
  Serialize,
  SerializeInterceptor,
} from '../interceptors/serialize.interceptor';

@Controller('users')
export class UsersController {
  private service: UsersService;

  constructor(service: UsersService) {
    this.service = service;
  }

  @Serialize(UserDto)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    console.log('findById is running', id);
    const user = await this.service.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
    // return UserDto.fromUser(user);
  }

  @Serialize(UserDto)
  @Get()
  async findAll(@Query('email') email?: string) {
    if (email) {
      const users = await this.service.find({ where: { email } });
      return users;

      // return users.map((user) => UserDto.fromUser(user));
    }

    const users = await this.service.find();
    return users;

    // return users.map((user) => UserDto.fromUser(user));
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
