import { PrismaService } from 'src/core/database/prisma.service';
import { CreateStudentDto } from './dto/create.dto';
import { EmailService } from 'src/common/email/email.service';
import { PaginationDto } from './dto/pagination.dto';
export declare class StudentsService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    getMyGroups(currentUser: {
        id: number;
    }): Promise<{
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
    createStudent(payload: CreateStudentDto, filename?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
