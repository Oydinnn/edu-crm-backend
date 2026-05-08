import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create.dto";
import { UpdateCourseDto } from "./dto/update.dto ";
export declare class CoursesController {
    private readonly courseService;
    constructor(courseService: CoursesService);
    getAllCourses(): Promise<{
        success: boolean;
        data: {
            id: number;
            status: import("@prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            name: string;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            duration_month: number;
            duration_hours: number;
        }[];
    }>;
    createCourse(payload: CreateCourseDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateCourse(id: number, payload: UpdateCourseDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteCourse(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
