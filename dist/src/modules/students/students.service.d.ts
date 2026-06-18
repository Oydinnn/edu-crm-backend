import { PrismaService } from "src/core/database/prisma.service";
import { CreateStudentDto } from "./dto/create.dto";
import { StudentStatus } from "@prisma/client";
import { PaginationDto } from "./dto/pagination.dto";
import { EmailService } from "src/common/email/email.service";
import { filterDto } from "./dto/search";
import { UpdateStudentDto } from "./dto/update.dto";
import { CreateHomeworkAnswerDto } from "./dto/createHomeworkAnswer.dto";
import { EskizService } from "src/common/services/sms";
export declare class StudentsService {
    private prisma;
    private emailService;
    private smsService;
    constructor(prisma: PrismaService, emailService: EmailService, smsService: EskizService);
    getMyGroups(currentUser: {
        id: number;
    }): Promise<{
        success: boolean;
        data: {
            groupName: string;
            courseName: string;
            teacherCount: number;
            startDate: Date;
            groupId: number;
            status: import("@prisma/client").$Enums.GroupStatus;
            weekDay: string[];
            startTime: string;
            teachers: {
                full_name: string;
                week_day: string[];
                role: string;
                start_time: string;
                duration_hours: number;
            }[];
        }[];
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
    createStudent(payload: CreateStudentDto, filename?: string): Promise<{
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
                group_id: number;
                student_id: number;
            })[];
            birth_date: Date;
        };
    }>;
    updateStudent(id: number, payload: UpdateStudentDto, filename?: string): Promise<{
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
    searchStudents(search: string): Promise<{
        success: boolean;
        data: {
            phone: string;
            email: string;
            id: number;
            photo: string | null;
            full_name: string;
        }[];
    }>;
    createHomeworkAnswer(homeworkId: number, currentUser: {
        id: number;
    }, payload: CreateHomeworkAnswerDto, filenames?: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
}
