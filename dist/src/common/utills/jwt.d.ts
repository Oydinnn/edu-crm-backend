import { JwtService } from "@nestjs/jwt";
export declare class JwtGenerateToken {
    private jwtService;
    constructor(jwtService: JwtService);
    generateAccessToken(payload: any): string;
    generateRefreshToken(payload: any): string;
    verifyToken(token: string): any;
}
