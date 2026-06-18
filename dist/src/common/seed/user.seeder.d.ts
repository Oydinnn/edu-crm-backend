import { OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
export default class UserSeeder implements OnModuleInit {
    private prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    seedSuperAdmin(): Promise<void>;
}
