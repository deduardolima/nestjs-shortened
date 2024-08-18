import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto } from './dto/create-auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginUserDto: LoginUserDto): Promise<AuthResponseDto>;
    register(email: string, password: string): Promise<AuthResponseDto>;
    private hash;
}
