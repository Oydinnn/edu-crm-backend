import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
export declare class LessonsController {
    private readonly lessonService;
    constructor(lessonService: LessonsService);
    getMyGroupLessons(groupId: number, req: Request): Promise<{
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
    createLesson(payload: CreateLessonDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
