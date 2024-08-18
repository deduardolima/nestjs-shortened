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
exports.UrlsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let UrlsService = class UrlsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(originalUrl, userId) {
        const shortUrl = await this.generatorShortcut();
        return this.prisma.$transaction(async (prisma) => {
            try {
                const createdUrl = await prisma.url.create({
                    data: {
                        originalUrl,
                        shortUrl,
                        ownerId: userId,
                    },
                    include: {
                        owner: true,
                    },
                });
                return this.toUrlResponseDto(createdUrl);
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    throw new common_1.BadRequestException(error.message);
                }
                throw new common_1.BadRequestException(error.message);
            }
        });
    }
    async findByShortUrl(shortUrl) {
        try {
            const short = this.prisma.url.findUnique({ where: { shortUrl } });
            if (!short) {
                throw new common_1.NotFoundException(`shortcut com string ${shortUrl} não encontrada`);
            }
            return short;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    async incrementClicks(shortUrl) {
        try {
            return this.prisma.url.update({
                where: { shortUrl },
                data: { clicks: { increment: 1 } },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    ;
    async findUserUrls(userId) {
        try {
            const urlFromDB = this.prisma.url.findMany({ where: { ownerId: userId } });
            if (!urlFromDB) {
                throw new common_1.NotFoundException(`Urls do userID ${userId} não encontradas`);
            }
            return urlFromDB;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateUrl(id, originalUrl, userId) {
        try {
        }
        catch (error) {
        }
        const url = await this.prisma.url.findUnique({ where: { id } });
        if (!url || url.ownerId !== userId) {
            throw new common_1.NotFoundException('URL não encontrada ou você não tem permissão para atualizá-la');
        }
        try {
            return this.prisma.url.update({
                where: { id },
                data: { originalUrl, updatedAt: new Date() },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteUrl(id, userId) {
        const url = await this.prisma.url.findUnique({ where: { id } });
        if (!url || url.ownerId !== userId) {
            throw new common_1.NotFoundException('URL não encontrada ou você não tem permissão para deletá-la');
        }
        try {
            await this.prisma.url.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    async generatorShortcut() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const maxAttemptsPerLength = 15;
        let length = 6;
        const minLength = 2;
        let attempts = 0;
        try {
            while (length >= minLength) {
                const shorty = Array.from({ length }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join('');
                const existingShorty = await this.findByShortUrl(shorty);
                if (!existingShorty) {
                    return shorty;
                }
                attempts++;
                if (attempts >= maxAttemptsPerLength) {
                    attempts = 0;
                    length--;
                }
            }
            throw new common_1.ConflictException('Erro ao gerar shorty aleatório, tente novamente');
        }
        catch (error) {
            console.error('Erro durante a geração do shorty:', error.message);
            throw new common_1.InternalServerErrorException('Erro durante o processo de geração do shorty');
        }
    }
    toUrlResponseDto(url) {
        return {
            id: url.id,
            originalUrl: url.originalUrl,
            shortUrl: `${process.env.BASE_URL}/${url.shortUrl}`,
            owner: url.owner ? {
                id: url.owner.id,
                email: url.owner.email,
            } : null,
        };
    }
};
exports.UrlsService = UrlsService;
exports.UrlsService = UrlsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UrlsService);
//# sourceMappingURL=urls.service.js.map