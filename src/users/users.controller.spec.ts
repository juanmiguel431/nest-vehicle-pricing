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
});
