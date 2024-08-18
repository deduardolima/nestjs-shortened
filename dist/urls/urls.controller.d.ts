import { CreateUrlDto, UrlResponseDto, UrlWithOwnerResponseDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlsService } from './urls.service';
export declare class UrlsController {
    private urlsService;
    constructor(urlsService: UrlsService);
    create(createUrlDto: CreateUrlDto, req: any): Promise<UrlWithOwnerResponseDto>;
    getUserUrls(req: any): Promise<UrlResponseDto[]>;
    updateUrl(id: string, updateUrlDto: UpdateUrlDto, req: any): Promise<{
        id: string;
        originalUrl: string;
        shortUrl: string;
        clicks: number;
        ownerId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    deleteUrl(id: string, req: any): Promise<{
        message: string;
    }>;
}
