import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create.dto';
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
            groups: {
                id: number;
                name: string;
            }[];
        }[];
    }>;
    createTeacher(payload: CreateTeacherDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
}
