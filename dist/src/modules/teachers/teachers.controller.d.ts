import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create.dto';
import { UpdateTeacherDto } from './dto/update.dto';
export declare class TeachersController {
    private readonly teacherService;
    constructor(teacherService: TeachersService);
    getAllTeachers(): Promise<{
        success: boolean;
        data: {
            id: number;
            full_name: string;
            phone: string;
            photo: string;
            email: string;
            address: string;
            created_at: Date;
            groups: {
                id: number;
                name: string;
            }[];
        }[];
    }>;
    createTeacher(payload: CreateTeacherDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            full_name: string;
            phone: string;
            email: string;
        };
    }>;
    updateTeacher(id: number, payload: UpdateTeacherDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            groupTeachers: ({
                group: {
                    id: number;
                    status: import("@prisma/client").$Enums.GroupStatus;
                    created_at: Date;
                    update_at: Date;
                    name: string;
                    description: string | null;
                    course_id: number;
                    room_id: number;
                    start_date: Date;
                    week_day: string[];
                    start_time: string;
                    max_student: number;
                };
            } & {
                id: number;
                created_at: Date;
                group_id: number;
                teacher_id: number;
            })[];
        } & {
            password: string;
            phone: string;
            email: string;
            address: string;
            id: number;
            photo: string | null;
            status: import("@prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            full_name: string;
        };
    }>;
    deleteTeacher(id: number): Promise<{
        password: string;
        phone: string;
        email: string;
        address: string;
        id: number;
        photo: string | null;
        status: import("@prisma/client").$Enums.Status;
        created_at: Date;
        update_at: Date;
        full_name: string;
    }>;
}
