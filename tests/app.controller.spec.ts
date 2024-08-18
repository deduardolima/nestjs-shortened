import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getOriginalUrl: jest.fn(),
            incrementClicks: jest.fn(),
            clear: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('redirect', () => {
    it('should redirect to original URL if found', async () => {
      const shortUrl = 'abc123';
      const originalUrl = 'http://example.com';
      const res = {
        status: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      } as any as Response;

      jest.spyOn(appService, 'getOriginalUrl').mockResolvedValue(originalUrl);

      await appController.redirect(shortUrl, res);

      expect(appService.getOriginalUrl).toHaveBeenCalledWith(shortUrl);
      expect(appService.incrementClicks).toHaveBeenCalledWith(shortUrl);
      expect(res.status).toHaveBeenCalledWith(301);
      expect(res.redirect).toHaveBeenCalledWith(originalUrl);
    });

    it('should return 404 if URL not found', async () => {
      const shortUrl = 'abc123';
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;

      jest.spyOn(appService, 'getOriginalUrl').mockResolvedValue(null);

      await appController.redirect(shortUrl, res);

      expect(appService.getOriginalUrl).toHaveBeenCalledWith(shortUrl);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('URL não encontrada');
    });
  });

  describe('clearCache', () => {
    it('should clear cache for the given shortUrl', async () => {
      const shortUrl = 'abc123';

      await appController.clearCache(shortUrl);

      expect(appService.clear).toHaveBeenCalledWith(shortUrl);
    });
  });
});
