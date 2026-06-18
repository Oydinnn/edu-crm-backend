import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { SendOtpPhoneDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    userLogin(payload: LoginDto): Promise<{
        success: boolean;
        message: string;
        role: import("@prisma/client").$Enums.Role;
        accessToken: string;
        refreshToken: string;
    }>;
    sendOtpPhone(payload: SendOtpPhoneDto): Promise<{
        success: boolean;
        message: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    verifyOtp(payload: VerifyOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshToken(payload: RefreshTokenDto): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
    }>;
    changePassword(payload: UpdatePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
