import { PrismaService } from "src/core/database/prisma.service";
import { CreateTeacherDto } from "./dto/create.dto";
export declare class TeachersService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllTeachers(): Promise<{
        success: boolean;
        data: {
            id: number;
            full_name: string;
            phone: string;
            photo: string;
            email: string;
            address: string;
            groups: {
                id: number;
                name: string;
            }[];
        }[];
    }>;
    createTeacher(payload: CreateTeacherDto, filename?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
