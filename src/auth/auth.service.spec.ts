import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@test.com';
    user.password = '1234';

    fakeUsersService = {
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

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.findByEmail = (email: string) => {
      const user = new User();
      user.id = 1;
      user.email = email;
      user.password = '1234';
      return Promise.resolve<User>(user);
    };

    await expect(service.signUp('test@test.com', '1234')).rejects.toThrow(
      Error,
    );
  });

  it('throws if signs in is called with an unused email', async () => {
    await expect(service.signIn('test@test.com', '1234')).rejects.toThrow(
      Error,
    );
  });

  it('throws if an invalid password is provided', async () => {
    const password = '1234';

    const user = new User();
    user.id = 1;
    user.email = 'test@test.com';
    user.password = AuthService.getPasswordHash(password);

    fakeUsersService.findByEmail = () => Promise.resolve(user);
    await expect(service.signIn('test@test.com', '5678')).rejects.toThrow(Error);
  });

  it('it returns a user if valid password is provided', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@test.com';
    user.password = AuthService.getPasswordHash('1234');

    fakeUsersService.findByEmail = () => Promise.resolve(user);
    const userLogged = await service.signIn('test@test.com', '1234');

    expect(userLogged).toEqual(user);
  });
});
