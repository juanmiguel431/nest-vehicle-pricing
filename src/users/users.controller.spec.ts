import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { FindManyOptions } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

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

  it('findById returns a single user with the given id', async () => {
    fakeUsersService.findById = (id: number) => {
      const user = new User();
      user.id = id;
      return Promise.resolve(user);
    }

    const foundUser = await controller.findById(1);
    expect(foundUser.id).toEqual(1);
  });

  it('findById throws an error if user with given id is not found', async () => {
    fakeUsersService.findById = (id: number) => Promise.resolve(null);
    await expect(controller.findById(1)).rejects.toThrow(NotFoundException);
  })
});
