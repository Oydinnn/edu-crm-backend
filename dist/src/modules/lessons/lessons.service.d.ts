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
                created_at: Date;
                title: string;
                file: string | null;
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
                created_at: Date;
                title: string;
                file: string | null;
            }[];
            studentAnswer: {
                id: number;
                created_at: Date;
                title: string;
                file: string | null;
            };
            homework?: undefined;
            homeworkResult?: undefined;
        };
    } | {
        success: boolean;
        data: {
            homeworks: {
                id: number;
                created_at: Date;
                title: string;
                file: string | null;
            };
            studentAnswer: {
                id: number;
                created_at: Date;
                title: string;
                file: string | null;
            };
            homeworkResult: {
                id: number;
                created_at: Date;
                teachers: {
                    full_name: string;
                } | null;
                users: {
                    first_name: string;
                    last_name: string;
                } | null;
                title: string;
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
        success: boolean;
        data: {
            id: number;
            status: import("@prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            group_id: number;
            teacher_id: number | null;
            description: string | null;
            user_id: number | null;
            topic: string;
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
