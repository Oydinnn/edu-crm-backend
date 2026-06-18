import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
export declare class LessonsController {
    private readonly lessonService;
    constructor(lessonService: LessonsService);
    getLessonHomeworks(groupId: number, lessonId: number, req: Request): Promise<{
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
    getLessonVideos(groupId: number, lessonId: number, req: Request): Promise<{
        success: boolean;
        data: {
            id: number;
            created_at: Date;
            originalname: string;
            video_url: string;
        }[];
    }>;
    getMyGroupLessons(groupId: number, req: Request): Promise<{
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
    createLesson(payload: CreateLessonDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
