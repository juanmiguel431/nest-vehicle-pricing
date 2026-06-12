import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const user = new User();
    user.id = 1;

    const fakeUsersService: Partial<UsersService> = {
      findById: (id: number) => Promise.resolve<User | null>(null),
      findByEmail: (email: string) => Promise.resolve<User | null>(null),
      find: () => Promise.resolve<User[]>([]),
      create: (email: string, password: string) => {
        user.email = email;
        user.password = password;
        return Promise.resolve<User>(user);
      },
      remove: (entity: User) => Promise.resolve<User>(user),
      update: (target: User, source: Partial<User>) =>
        Promise.resolve<User>(user),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of AuthService', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('test@test.com', '123456');

    expect(user.password).not.toEqual('123456');
  });
});
