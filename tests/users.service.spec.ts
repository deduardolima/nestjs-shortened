import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { UsersService } from '../src/users/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user by ID', async () => {
    const user = {
      id: '1',
      email: 'test@test.com',
      hashPassword: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      urls: []

    };
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(user);

    const result = await service.findOne('1');
    expect(result).toEqual(user);
  });

  it('should throw a NotFoundException if user not found', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

    try {
      await service.findOne('1');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });
});
