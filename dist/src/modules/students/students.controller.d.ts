import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create.dto';
import { PaginationDto } from './dto/pagination.dto';
export declare class StudentsController {
    private readonly studentService;
    constructor(studentService: StudentsService);
    getMyGroups(req: Request): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
        }[];
    }>;
    getAllStudents(pagination: PaginationDto): Promise<{
        success: boolean;
        data: {
            first_name: string;
            last_name: string;
            phone: string;
            email: string;
            address: string;
            id: number;
            photo: string | null;
            birth_date: Date;
        }[];
    }>;
    createStudent(payload: CreateStudentDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
}
