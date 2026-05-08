import { PrismaService } from "src/core/database/prisma.service";
import { CreateHomeworkDto } from "./dto/create.dto";
import { Role } from "@prisma/client";
export declare class HomeworkService {
    private prisma;
    constructor(prisma: PrismaService);
    getOwnHomework(lessonId: number, currentUser: {
        id: number;
    }): Promise<{
        success: boolean;
        data: ({
            id: number;
            title: string;
            file: string | null;
            created_at: Date;
            update_at: Date;
            user: {
                first_name: string;
                last_name: string;
                phone: string;
                id: number;
                photo: string | null;
            } | null;
            teacher?: undefined;
        } | {
            id: number;
            title: string;
            file: string | null;
            created_at: Date;
            update_at: Date;
            teacher: {
                phone: string;
                id: number;
                photo: string | null;
                full_name: string;
            };
            user?: undefined;
        })[];
    }>;
    getAllHomework(): Promise<{
        success: boolean;
        data: {
            id: number;
            created_at: Date;
            update_at: Date;
            group_id: number;
            title: string;
            file: string | null;
            teacher_id: number | null;
            user_id: number | null;
            lesson_id: number;
        }[];
    }>;
    createHomework(payload: CreateHomeworkDto, currentUser: {
        id: number;
        role: Role;
    }, filename?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
