import { User } from '../user.entity';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  static fromUser(user: User) {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.email = user.email;
    return userDto;
  }
}