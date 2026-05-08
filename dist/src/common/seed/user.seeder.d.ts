import { OnModuleInit } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/core/database/prisma.service";
export default class UserSeeder implements OnModuleInit {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    onModuleInit(): Promise<void>;
}
