import { Cache } from 'cache-manager';
import { TraceService } from 'nestjs-otel';
import { UrlsService } from './urls/urls.service';
export declare class AppService {
    private readonly urlsService;
    private readonly traceService;
    private cacheManager;
    constructor(urlsService: UrlsService, traceService: TraceService, cacheManager: Cache);
    getOriginalUrl(shortUrl: string): Promise<string | null>;
    clear(shortUrl: string): Promise<void>;
    incrementClicks(shortUrl: string): Promise<void>;
}
