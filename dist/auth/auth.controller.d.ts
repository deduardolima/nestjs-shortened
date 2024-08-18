import { AuthService } from './auth.service';
import { AuthResponseDto, CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateAuthDto): Promise<AuthResponseDto>;
    login(loginDto: LoginUserDto): Promise<AuthResponseDto>;
}
