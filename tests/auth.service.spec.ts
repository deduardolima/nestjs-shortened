import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login({ email: 'test@test.com', password: 'password' }))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should return a valid JWT token if credentials are valid', async () => {
      const user = { id: '1', email: 'test@test.com', role: 'user' };
      jest.spyOn(service, 'validateUser').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('signed-token');

      const result = await service.login({ email: 'test@test.com', password: 'password' });

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        access_token: 'signed-token',
      });
    });
  });

  describe('register', () => {
    it('should register a new user and return a JWT token', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        hashPassword: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date()

      };
      jest.spyOn(usersService, 'create').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('signed-token');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.register('test@test.com', 'password');

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        access_token: 'signed-token',
      });
    });
  });
});
