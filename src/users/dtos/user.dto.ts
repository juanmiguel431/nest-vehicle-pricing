import { User } from '../user.entity';

export class UserDto {
  id: number;
  email: string;

  static fromUser(user: User) {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.email = user.email;
    return userDto;
  }
}