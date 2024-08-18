import { AppService } from './app.service';
import { Response } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    redirect(shortUrl: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    clearCache(shortUrl: string): Promise<string>;
}
