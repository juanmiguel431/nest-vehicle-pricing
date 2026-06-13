import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { SignInDto } from '../users/dtos/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    fakeAuthService = {};
    fakeUserService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
        {
          provide: UsersService,
          useValue: fakeUserService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signIn should return a user when provided correct credentials and updates session', async () => {
    // fakeAuthService.signIn = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' });
    const user = new User();

    fakeAuthService.signIn = (email, password) => {
      user.id = 1;
      user.email = email;
      return Promise.resolve(user);
    };

    const session: Record<string, any> = {};
    const body = new SignInDto();
    body.email = 'test@example.com';
    body.password = 'password';
    const result = await controller.signIn(body, session);

    expect(result.email).toEqual('test@example.com');
    expect(session.userId).toEqual(1);
  });
});
