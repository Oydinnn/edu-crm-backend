import { StudentStatus } from '@prisma/client';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateStudentDto } from './dto/update.dto';
import { filterDto } from './dto/search';
export declare class StudentsController {
    private readonly studentService;
    constructor(studentService: StudentsService);
    getMyGroups(req: Request): Promise<{
        success: boolean;
        data: ({
            courses: {
                id: number;
                status: import("@prisma/client").$Enums.Status;
                created_at: Date;
                update_at: Date;
                name: string;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                duration_month: number;
                duration_hours: number;
            };
            rooms: {
                id: number;
                status: import("@prisma/client").$Enums.Status;
                created_at: Date;
                update_at: Date;
                name: string;
                capacity: number | null;
            };
        } & {
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
        })[];
    }>;
    getAllStudents(pagination: PaginationDto, search: filterDto): Promise<{
        success: boolean;
        data: {
            id: number;
            full_name: string;
            photo: string | null;
            phone: string;
            email: string;
            status: import("@prisma/client").$Enums.StudentStatus;
            address: string;
            birth_date: Date;
            created_at: Date;
            groups: {
                id: number;
                name: string;
            }[];
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createStudent(payload: CreateStudentDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            full_name: string;
            email: string;
            phone: string;
            groups: number[];
        };
    }>;
    getStudentById(id: number): Promise<{
        success: boolean;
        data: {
            phone: string;
            email: string;
            address: string;
            id: number;
            photo: string | null;
            full_name: string;
            birth_date: Date;
            studentGroups: ({
                groups: {
                    courses: {
                        id: number;
                        status: import("@prisma/client").$Enums.Status;
                        created_at: Date;
                        update_at: Date;
                        name: string;
                        description: string | null;
                        price: import("@prisma/client-runtime-utils").Decimal;
                        duration_month: number;
                        duration_hours: number;
                    };
                    rooms: {
                        id: number;
                        status: import("@prisma/client").$Enums.Status;
                        created_at: Date;
                        update_at: Date;
                        name: string;
                        capacity: number | null;
                    };
                } & {
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
                status: import("@prisma/client").$Enums.Status;
                created_at: Date;
                update_at: Date;
                student_id: number;
                group_id: number;
            })[];
        };
    }>;
    updateStudent(id: number, payload: UpdateStudentDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            password: string;
            phone: string;
            email: string;
            address: string;
            id: number;
            photo: string | null;
            status: import("@prisma/client").$Enums.StudentStatus;
            created_at: Date;
            update_at: Date;
            full_name: string;
            birth_date: Date;
        };
    }>;
    toggleStatus(id: number, status: StudentStatus): Promise<{
        password: string;
        phone: string;
        email: string;
        address: string;
        id: number;
        photo: string | null;
        status: import("@prisma/client").$Enums.StudentStatus;
        created_at: Date;
        update_at: Date;
        full_name: string;
        birth_date: Date;
    }>;
    deleteStudent(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
