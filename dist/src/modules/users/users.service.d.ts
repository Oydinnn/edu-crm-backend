import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAdminDto } from './dto/create.admin.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllAdmins(): Promise<{
        success: boolean;
        data: {
            id: number;
            first_name: string;
            last_name: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string;
            email: string;
            photo: string | null;
        }[];
    }>;
    createAdmin(payload: CreateAdminDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getMe(userId: number, role: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getDashboardStats(): Promise<{
        success: boolean;
        data: {
            groups: number;
            courses: number;
            students: number;
            teachers: number;
        };
    }>;
}
