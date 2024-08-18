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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async redirect(shortUrl, res) {
        const originalUrl = await this.appService.getOriginalUrl(shortUrl);
        if (originalUrl) {
            await this.appService.incrementClicks(shortUrl);
            return res.status(301).redirect(originalUrl);
        }
        return res.status(404).send('URL não encontrada');
    }
    async clearCache(shortUrl) {
        await this.appService.clear(shortUrl);
        return `Cache shorty ${shortUrl} foi limpo`;
    }
    ;
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(':shortUrl'),
    __param(0, (0, common_1.Param)('shortUrl')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)('cache/:shortUrl'),
    __param(0, (0, common_1.Param)('shortUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "clearCache", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('ShortUrl'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map