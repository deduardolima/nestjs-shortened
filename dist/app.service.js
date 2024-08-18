"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const nestjs_otel_1 = require("nestjs-otel");
const urls_service_1 = require("./urls/urls.service");
let AppService = class AppService {
    constructor(urlsService, traceService, cacheManager) {
        this.urlsService = urlsService;
        this.traceService = traceService;
        this.cacheManager = cacheManager;
    }
    async getOriginalUrl(shortUrl) {
        const currentSpan = this.traceService.getSpan();
        currentSpan.addEvent('get originalUrl event');
        currentSpan.end();
        const cachedUrl = await this.cacheManager.get(shortUrl);
        if (cachedUrl) {
            return cachedUrl;
        }
        const url = await this.urlsService.findByShortUrl(shortUrl);
        if (url) {
            await this.cacheManager.set(shortUrl, url.originalUrl);
            return url.originalUrl;
        }
        return null;
    }
    ;
    async clear(shortUrl) {
        await this.cacheManager.del(shortUrl);
    }
    ;
    async incrementClicks(shortUrl) {
        await this.urlsService.incrementClicks(shortUrl);
    }
};
exports.AppService = AppService;
__decorate([
    (0, nestjs_otel_1.Span)('Get OriginalUrl'),
    (0, nestjs_otel_1.OtelMethodCounter)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppService.prototype, "getOriginalUrl", null);
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [urls_service_1.UrlsService,
        nestjs_otel_1.TraceService, Object])
], AppService);
//# sourceMappingURL=app.service.js.map