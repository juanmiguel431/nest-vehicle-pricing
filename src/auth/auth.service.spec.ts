import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@test.com';
    user.password = '123456';

    const fakeUsersService: Partial<UsersService> = {
      findById: (id: number) => Promise.resolve<User | null>(null),
      findByEmail: (email: string) => Promise.resolve<User | null>(null),
      find: () => Promise.resolve<User[]>([]),
      create: (email: string, password: string) => Promise.resolve<User>(user),
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
});
