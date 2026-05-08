import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    userLogin(payload: LoginDto): Promise<{
        success: boolean;
        message: string;
        accessToken: string;
        role: any;
    }>;
}
