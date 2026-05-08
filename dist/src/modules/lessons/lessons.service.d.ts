import { PrismaService } from "src/core/database/prisma.service";
import { CreateLessonDto } from "./dto/create.lesson.dto";
import { Role } from "@prisma/client";
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyGroupLessons(groupId: number, currentUser: {
        id: number;
    }): Promise<{
        success: boolean;
        data: {
            id: number;
            created_at: Date;
            topic: string;
        }[];
    }>;
    getAllLessons(): Promise<{
        sucess: boolean;
        data: {
            id: number;
            status: import("@prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            description: string | null;
            group_id: number;
            teacher_id: number | null;
            topic: string;
            user_id: number | null;
        }[];
    }>;
    createLesson(payload: CreateLessonDto, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
