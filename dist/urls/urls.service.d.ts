import { Url } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UrlResponseDto, UrlWithOwnerResponseDto } from './dto/create-url.dto';
export declare class UrlsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(originalUrl: string, userId?: string): Promise<UrlWithOwnerResponseDto>;
    findByShortUrl(shortUrl: string): Promise<{
        id: string;
        originalUrl: string;
        shortUrl: string;
        clicks: number;
        ownerId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    incrementClicks(shortUrl: string): Promise<{
        id: string;
        originalUrl: string;
        shortUrl: string;
        clicks: number;
        ownerId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findUserUrls(userId: string): Promise<UrlResponseDto[]>;
    updateUrl(id: string, originalUrl: string, userId: string): Promise<Url>;
    deleteUrl(id: string, userId: string): Promise<void>;
    generatorShortcut(): Promise<string>;
    private toUrlResponseDto;
}
