import { CacheModule } from '@nestjs/cache-manager';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MetricService, TraceService } from 'nestjs-otel';
import { AppService } from '../src/app.service';
import { UrlsService } from '../src/urls/urls.service';

describe('AppService', () => {
  let appService: AppService;
  let urlsService: UrlsService;
  let traceService: TraceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
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
          provide: TraceService,
          useValue: {
            getSpan: jest.fn().mockReturnValue({
              addEvent: jest.fn(),
              end: jest.fn(),
            }),
          },
        },
        {
          provide: MetricService,
          useValue: {
            getCounter: jest.fn().mockReturnValue({
              add: jest.fn(),
            }),
            getHistogram: jest.fn().mockReturnValue({
              record: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    urlsService = module.get<UrlsService>(UrlsService);
    traceService = module.get<TraceService>(TraceService);
  });

  it('should return cached URL if found in cache', async () => {
    const shortUrl = 'shortUrl';
    const cachedUrl = 'cachedUrl';

    jest.spyOn(appService['cacheManager'], 'get').mockResolvedValue(cachedUrl);

    const result = await appService.getOriginalUrl(shortUrl);
    expect(result).toBe(cachedUrl);
  });

  it('should return URL from database if not found in cache', async () => {
    const shortUrl = 'shortUrl';
    const originalUrl = 'originalUrl';

    jest.spyOn(appService['cacheManager'], 'get').mockResolvedValue(null);
    jest.spyOn(urlsService, 'findByShortUrl').mockResolvedValue({ originalUrl } as any);
    jest.spyOn(appService['cacheManager'], 'set').mockResolvedValue();

    const result = await appService.getOriginalUrl(shortUrl);
    expect(result).toBe(originalUrl);
  });

  it('should return null if URL not found in database', async () => {
    const shortUrl = 'shortUrl';

    jest.spyOn(appService['cacheManager'], 'get').mockResolvedValue(null);
    jest.spyOn(urlsService, 'findByShortUrl').mockResolvedValue(null);

    const result = await appService.getOriginalUrl(shortUrl);
    expect(result).toBeNull();
  });

  it('should call incrementClicks on urlsService', async () => {
    const shortUrl = 'shortUrl';

    await appService.incrementClicks(shortUrl);
    expect(urlsService.incrementClicks).toHaveBeenCalledWith(shortUrl);
  });

  it('should throw an error if there is an issue retrieving URL from database', async () => {
    const shortUrl = 'shortUrl';

    jest.spyOn(appService['cacheManager'], 'get').mockResolvedValue(null);
    jest.spyOn(urlsService, 'findByShortUrl').mockRejectedValue(new InternalServerErrorException());

    await expect(appService.getOriginalUrl(shortUrl)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw an error if there is an issue incrementing clicks', async () => {
    const shortUrl = 'shortUrl';

    jest.spyOn(urlsService, 'incrementClicks').mockRejectedValue(new InternalServerErrorException());

    await expect(appService.incrementClicks(shortUrl)).rejects.toThrow(InternalServerErrorException);
  });
});
