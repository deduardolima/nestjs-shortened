import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com' }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a user by ID', async () => {
    const result = await controller.getUserById('1');
    expect(result).toEqual({ id: '1', email: 'test@test.com' });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should throw a NotFoundException if user not found', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
    try {
      await controller.getUserById('1');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });
});
