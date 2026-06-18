import { PrismaService } from "src/core/database/prisma.service";
import { CreateTeacherDto } from "./dto/create.dto";
import { EmailService } from "src/common/email/email.service";
import { UpdateTeacherDto } from "./dto/update.dto";
import { EskizService } from "src/common/services/sms";
export declare class TeachersService {
    private prisma;
    private emailService;
    private smsService;
    constructor(prisma: PrismaService, emailService: EmailService, smsService: EskizService);
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
    getMyGroups(teacherId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            max_student: number;
            start_date: Date;
            start_time: string;
            weekDay: string[];
            status: import("@prisma/client").$Enums.GroupStatus;
            description: string | null;
            course: string;
            course_duration_month: number;
            course_duration_hours: number;
            room: string;
            students: {
                id: number;
                _count: {
                    studentGroups: number;
                    attendances: number;
                    homeworkAnswerStudents: number;
                };
                full_name: string;
            }[];
            student_count: number;
        }[];
    }>;
    createTeacher(payload: CreateTeacherDto, filename?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            full_name: string;
            phone: string;
            email: string;
        };
    }>;
    updateTeacher(id: number, payload: UpdateTeacherDto, photoFilename?: string): Promise<{
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
                status: import("@prisma/client").$Enums.TeacherGroupStatus;
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
