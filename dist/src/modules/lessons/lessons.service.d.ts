import { PrismaService } from "src/core/database/prisma.service";
import { CreateLessonDto } from "./dto/create.lesson.dto";
import { Role } from "@prisma/client";
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    getLessonHomeworks(groupId: number, lessonId: number, currentUser: {
        id: number;
    }): Promise<{
        success: boolean;
        data: never[];
    } | {
        success: boolean;
        data: {
            homework: {
                id: number;
                title: string;
                file: string | null;
                created_at: Date;
            };
            studentAnswer: null;
            homeworkResult: null;
            homeworks?: undefined;
        };
    } | {
        success: boolean;
        data: {
            homeworks: {
                id: number;
                title: string;
                file: string | null;
                created_at: Date;
            }[];
            studentAnswer: {
                id: number;
                title: string;
                file: string | null;
                created_at: Date;
            };
            homework?: undefined;
            homeworkResult?: undefined;
        };
    } | {
        success: boolean;
        data: {
            homeworks: {
                id: number;
                title: string;
                file: string | null;
                created_at: Date;
            };
            studentAnswer: {
                id: number;
                title: string;
                file: string | null;
                created_at: Date;
            };
            homeworkResult: {
                id: number;
                title: string;
                created_at: Date;
                teachers: {
                    full_name: string;
                } | null;
                users: {
                    first_name: string;
                    last_name: string;
                } | null;
                grade: number;
            };
            homework?: undefined;
        };
    }>;
    getLessonVideos(groupId: number, lessonId: number, currentUser: {
        id: number;
    }): Promise<{
        success: boolean;
        data: {
            id: number;
            created_at: Date;
            originalname: string;
            video_url: string;
        }[];
    }>;
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
            teacher_id: number | null;
            user_id: number | null;
            group_id: number;
            created_at: Date;
            update_at: Date;
            status: import("@prisma/client").$Enums.Status;
            topic: string;
            description: string | null;
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
