import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should return the registered user', async () => {
      const result = { id: '1', email: 'test@test.com', access_token: 'signed-token' };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await controller.register({ email: 'test@test.com', password: 'password' })).toBe(result);
    });
  });

  describe('login', () => {
    it('should return the logged in user with JWT token', async () => {
      const result = { id: '1', email: 'test@test.com', access_token: 'signed-token' };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await controller.login({ email: 'test@test.com', password: 'password' })).toBe(result);
    });
  });

});
