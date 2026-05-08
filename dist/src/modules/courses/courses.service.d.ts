import { CreateCourseDto } from './dto/create.dto';
import { UpdateCourseDto } from './dto/update.dto ';
import { PrismaService } from 'src/core/database/prisma.service';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
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
