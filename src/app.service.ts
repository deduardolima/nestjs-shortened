import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MetricService, OtelMethodCounter, Span, TraceService } from 'nestjs-otel';
import { UrlsService } from './urls/urls.service';

@Injectable()
export class AppService {
  private readonly redirectCounter;
  private readonly cacheHitCounter;
  private readonly latencyHistogram;

  constructor(
    private readonly urlsService: UrlsService,
    private readonly traceService: TraceService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly metricService: MetricService,
  ) {
    this.redirectCounter = this.metricService.getCounter('redirect_count', {
      description: 'Número de redirecionamentos de URLs',
    });
    this.cacheHitCounter = this.metricService.getCounter('cache_hit_count', {
      description: 'Número de acertos de cache durante redirecionamentos de URLs',
    });
    this.latencyHistogram = this.metricService.getHistogram('redirect_latency', {
      description: 'Latência dos redirecionamentos de URLs em milissegundos',
    });
  }

  @Span('Get OriginalUrl')
  @OtelMethodCounter()
  async getOriginalUrl(shortUrl: string): Promise<string | null> {
    const startTime = Date.now();

    const currentSpan = this.traceService.getSpan();
    currentSpan.addEvent('evento get originalUrl');

    const cachedUrl = await this.cacheManager.get<string>(shortUrl);
    if (cachedUrl) {
      this.cacheHitCounter.add(1);
      this.latencyHistogram.record(Date.now() - startTime, { cache: 'hit' });
      currentSpan.end();
      return cachedUrl;
    }

    const url = await this.urlsService.findByShortUrl(shortUrl);
    if (url) {
      await this.cacheManager.set(shortUrl, url.originalUrl);
      this.latencyHistogram.record(Date.now() - startTime, { cache: 'miss' });
      currentSpan.end();
      return url.originalUrl;
    }

    this.latencyHistogram.record(Date.now() - startTime, { cache: 'miss' });
    currentSpan.end();
    return null;
  }

  async clear(shortUrl: string) {
    await this.cacheManager.del(shortUrl);
  }

  async incrementClicks(shortUrl: string): Promise<void> {
    this.redirectCounter.add(1);
    await this.urlsService.incrementClicks(shortUrl);
  }
}
