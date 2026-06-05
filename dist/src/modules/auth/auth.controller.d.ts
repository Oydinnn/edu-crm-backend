import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    userLogin(payload: LoginDto): Promise<{
        success: boolean;
        message: string;
        role: import("@prisma/client").$Enums.Role | undefined;
        accessToken: string;
    }>;
}
