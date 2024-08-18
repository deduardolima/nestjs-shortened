import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        hashPassword: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
