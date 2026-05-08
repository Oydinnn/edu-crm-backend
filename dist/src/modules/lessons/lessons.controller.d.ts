import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
export declare class LessonsController {
    private readonly lessonService;
    constructor(lessonService: LessonsService);
    getMyGroupLessons(groupId: number, req: Request): Promise<{
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
    createLesson(payload: CreateLessonDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
