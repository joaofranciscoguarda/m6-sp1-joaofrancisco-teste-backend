import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: CreateUserDto): Promise<{
        user: object;
        token: string;
    }>;
    signin(dto: LoginUserDto): Promise<{
        user: object;
        token: string;
    }>;
}
