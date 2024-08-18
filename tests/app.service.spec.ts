import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { AppService } from '../src/app.service';
import { UrlsService } from '../src/urls/urls.service';

describe('AppService', () => {
  let appService: AppService;
  let urlsService: UrlsService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: UrlsService,
          useValue: {
            findByShortUrl: jest.fn(),
            incrementClicks: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    urlsService = module.get<UrlsService>(UrlsService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('getOriginalUrl', () => {
    it('should return cached URL if found in cache', async () => {
      const shortUrl = 'abc123';
      const cachedUrl = 'http://example.com';

      jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedUrl);

      const result = await appService.getOriginalUrl(shortUrl);

      expect(cacheManager.get).toHaveBeenCalledWith(shortUrl);
      expect(result).toBe(cachedUrl);
    });

    it('should return URL from database if not found in cache', async () => {
      const shortUrl = 'abc123';
      const url = {
        id: '1',
        originalUrl: 'http://example.com',
        shortUrl: 'abc123',
        clicks: 0,
        ownerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(urlsService, 'findByShortUrl').mockResolvedValue(url);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      const result = await appService.getOriginalUrl(shortUrl);

      expect(urlsService.findByShortUrl).toHaveBeenCalledWith(shortUrl);
      expect(cacheManager.set).toHaveBeenCalledWith(shortUrl, url.originalUrl);
      expect(result).toBe(url.originalUrl);
    });


    it('should return null if URL not found in database', async () => {
      const shortUrl = 'abc123';

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(urlsService, 'findByShortUrl').mockResolvedValue(null);

      const result = await appService.getOriginalUrl(shortUrl);

      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear the cache for the given shortUrl', async () => {
      const shortUrl = 'abc123';

      await appService.clear(shortUrl);

      expect(cacheManager.del).toHaveBeenCalledWith(shortUrl);
    });
  });

  describe('incrementClicks', () => {
    it('should call incrementClicks on urlsService', async () => {
      const shortUrl = 'abc123';

      await appService.incrementClicks(shortUrl);

      expect(urlsService.incrementClicks).toHaveBeenCalledWith(shortUrl);
    });
  });
});
