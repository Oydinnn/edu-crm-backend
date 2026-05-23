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
            topic: string;
            id: number;
            created_at: Date;
        }[];
    }>;
    getAllLessons(): Promise<{
        sucess: boolean;
        data: {
            group_id: number;
            topic: string;
            description: string | null;
            id: number;
            status: import("@prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            teacher_id: number | null;
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
