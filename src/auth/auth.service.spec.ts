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
    const user = new User();
    user.id = 1;
    user.email = 'test@test.com';
    user.password = '1$sha512$64$16384$8$1$3cf687834be7e98824196780fa7eddb4$97dc3a0a1430c399ada5e74dd1c20f7212738c9e419a1aa282a380f4728df55dbf0b05aec81c95b2e1aa07c336cab6fd25e0f5f1547352ab4d3af0a3478dc92a';

    fakeUsersService.findByEmail = () => Promise.resolve(user);
    await expect(service.signIn('test@test.com', '5678')).rejects.toThrow(Error);
  });

  it('it returns a user if valid password is provided', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@test.com';
    user.password = '1$sha512$64$16384$8$1$3cf687834be7e98824196780fa7eddb4$ce08d7f4b023ee2c1ada6df9a5a73fea8ca2b08d775dfff1e67b5aa8b0f0aeeb504a2e8fd2a03b7871495696a500f636e9ff58cbd4eb335158ac4d6871b2b1bf';

    fakeUsersService.findByEmail = () => Promise.resolve(user);
    const userLogged = await service.signIn('test@test.com', '5678');

    expect(userLogged).toEqual(user);
  });
});
