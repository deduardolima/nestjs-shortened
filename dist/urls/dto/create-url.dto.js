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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlResponseDto = exports.UrlWithOwnerResponseDto = exports.CreateUrlDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_user_dto_1 = require("../../users/dto/create-user.dto");
class CreateUrlDto {
}
exports.CreateUrlDto = CreateUrlDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/' }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateUrlDto.prototype, "originalUrl", void 0);
class UrlWithOwnerResponseDto {
}
exports.UrlWithOwnerResponseDto = UrlWithOwnerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10362dsa56-415d1sa4ds-a7d1as414-d1ad1sa5' }),
    __metadata("design:type", String)
], UrlWithOwnerResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/' }),
    __metadata("design:type", String)
], UrlWithOwnerResponseDto.prototype, "originalUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://localhost:3000/D5a1Fr' }),
    __metadata("design:type", String)
], UrlWithOwnerResponseDto.prototype, "shortUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ type: create_user_dto_1.CreateUserDto }),
    __metadata("design:type", create_user_dto_1.CreateUserDto)
], UrlWithOwnerResponseDto.prototype, "owner", void 0);
class UrlResponseDto {
}
exports.UrlResponseDto = UrlResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10362dsa56-415d1sa4ds-a7d1as414-d1ad1sa5' }),
    __metadata("design:type", String)
], UrlResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/' }),
    __metadata("design:type", String)
], UrlResponseDto.prototype, "originalUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KTCeYd' }),
    __metadata("design:type", String)
], UrlResponseDto.prototype, "shortUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], UrlResponseDto.prototype, "clicks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10362dsa56-415d1sa4ds-a7d1as414-d1ad1sa5' }),
    __metadata("design:type", String)
], UrlResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12024-08-16T19:04:38.256Z' }),
    __metadata("design:type", Date)
], UrlResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-08-16T19:08:01.445Z' }),
    __metadata("design:type", Date)
], UrlResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'null' }),
    __metadata("design:type", Date)
], UrlResponseDto.prototype, "deletedAt", void 0);
//# sourceMappingURL=create-url.dto.js.map