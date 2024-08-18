import { CreateUserDto } from "../../users/dto/create-user.dto";
export declare class CreateUrlDto {
    originalUrl: string;
}
export declare class UrlWithOwnerResponseDto {
    id: string;
    originalUrl: string;
    shortUrl: string;
    owner: CreateUserDto;
}
export declare class UrlResponseDto {
    id: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
