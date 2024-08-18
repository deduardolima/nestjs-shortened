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
exports.UrlsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const optional_auth_guard_1 = require("../auth/guards/optional-auth.guard");
const api_response_1 = require("../error/api.response");
const create_url_dto_1 = require("./dto/create-url.dto");
const update_url_dto_1 = require("./dto/update-url.dto");
const urls_service_1 = require("./urls.service");
let UrlsController = class UrlsController {
    constructor(urlsService) {
        this.urlsService = urlsService;
    }
    async create(createUrlDto, req) {
        const userId = req.user ? req.user.userId : null;
        return this.urlsService.create(createUrlDto.originalUrl, userId);
    }
    async getUserUrls(req) {
        return this.urlsService.findUserUrls(req.user.userId);
    }
    async updateUrl(id, updateUrlDto, req) {
        return this.urlsService.updateUrl(id, updateUrlDto.originalUrl, req.user.userId);
    }
    async deleteUrl(id, req) {
        await this.urlsService.deleteUrl(id, req.user.userId);
        return { message: 'URL deletada com sucesso' };
    }
};
exports.UrlsController = UrlsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, api_response_1.ApiCommonResponses)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criação de url encurtada', description: 'Endpoint para criar nova url encurtada' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Url encurtada com sucesso', type: create_url_dto_1.UrlWithOwnerResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_url_dto_1.CreateUrlDto, Object]),
    __metadata("design:returntype", Promise)
], UrlsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, api_response_1.ApiCommonResponses)(),
    (0, swagger_1.ApiOperation)({ summary: 'Pega todas Urls encurtadas do próprio usuário', description: 'Endpoint para todas Urls encurtadas do próprio usuário com usuário autenticado via Bearer Token' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Urls encotradas com sucesso', type: create_url_dto_1.UrlResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UrlsController.prototype, "getUserUrls", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, api_response_1.ApiCommonResponses)(),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar URL original' }),
    (0, swagger_1.ApiOkResponse)({ description: 'URL atualizada com sucesso', type: create_url_dto_1.UrlResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_url_dto_1.UpdateUrlDto, Object]),
    __metadata("design:returntype", Promise)
], UrlsController.prototype, "updateUrl", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, api_response_1.ApiCommonResponses)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletar URL encurtada' }),
    (0, swagger_1.ApiOkResponse)({ description: 'URL deletada com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UrlsController.prototype, "deleteUrl", null);
exports.UrlsController = UrlsController = __decorate([
    (0, swagger_1.ApiTags)('Urls'),
    (0, common_1.Controller)('urls'),
    __metadata("design:paramtypes", [urls_service_1.UrlsService])
], UrlsController);
//# sourceMappingURL=urls.controller.js.map