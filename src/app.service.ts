import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { OtelMethodCounter, Span, TraceService } from 'nestjs-otel';
import { UrlsService } from './urls/urls.service';

@Injectable()
export class AppService {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly traceService: TraceService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  @Span('Get OriginalUrl')
  @OtelMethodCounter()
  async getOriginalUrl(shortUrl: string): Promise<string | null> {
    const currentSpan = this.traceService.getSpan();
    currentSpan.addEvent('get originalUrl event');
    currentSpan.end();
    const cachedUrl = await this.cacheManager.get<string>(shortUrl);
    if (cachedUrl) {
      return cachedUrl;
    }
    const url = await this.urlsService.findByShortUrl(shortUrl);

    if (url) {
      await this.cacheManager.set(shortUrl, url.originalUrl);
      return url.originalUrl;
    }

    return null;
  };

  async clear(shortUrl: string) {
    await this.cacheManager.del(shortUrl);
  };

  async incrementClicks(shortUrl: string): Promise<void> {
    await this.urlsService.incrementClicks(shortUrl);
  }
}
