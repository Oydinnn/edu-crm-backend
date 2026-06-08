import { Role } from "@prisma/client";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateAttendanceDto } from "./dto/create.dto";
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllAttendance(): Promise<{
        seccess: boolean;
        data: {
            id: number;
            created_at: Date;
            update_at: Date;
            teacher_id: number | null;
            student_id: number;
            user_id: number | null;
            lesson_id: number;
            isPresent: boolean;
        }[];
    }>;
    createAttendance(payload: CreateAttendanceDto, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
