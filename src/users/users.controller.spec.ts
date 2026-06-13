import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { FindManyOptions } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      findById: (id: number) => Promise.resolve<User | null>(null),
      find: (options?: FindManyOptions<User> | undefined) => Promise.resolve<User[]>([]),
      remove: (entity) => Promise.resolve<User>(entity),
      update: (target: User, source: Partial<User>) => Promise.resolve<User>(target),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns a list of users with the given email', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'tests@test.com';
    fakeUsersService.find = () => Promise.resolve([user]);

    const users = await controller.findAll('tests@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('tests@test.com');
  });
});
