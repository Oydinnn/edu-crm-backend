import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAdminDto } from './dto/create.admin.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllAdmins(): Promise<{
        success: boolean;
        data: {
            first_name: string;
            last_name: string;
            phone: string;
            email: string;
            id: number;
            role: import("@prisma/client").$Enums.Role;
            photo: string | null;
        }[];
    }>;
    createAdmin(payload: CreateAdminDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
