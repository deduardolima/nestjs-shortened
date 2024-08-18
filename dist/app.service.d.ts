import { Cache } from 'cache-manager';
import { MetricService, TraceService } from 'nestjs-otel';
import { UrlsService } from './urls/urls.service';
export declare class AppService {
    private readonly urlsService;
    private readonly traceService;
    private cacheManager;
    private readonly metricService;
    private readonly redirectCounter;
    private readonly cacheHitCounter;
    private readonly latencyHistogram;
    constructor(urlsService: UrlsService, traceService: TraceService, cacheManager: Cache, metricService: MetricService);
    getOriginalUrl(shortUrl: string): Promise<string | null>;
    clear(shortUrl: string): Promise<void>;
    incrementClicks(shortUrl: string): Promise<void>;
}
