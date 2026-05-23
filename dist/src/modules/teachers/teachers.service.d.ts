import { PrismaService } from "src/core/database/prisma.service";
import { CreateTeacherDto } from "./dto/create.dto";
import { EmailService } from "src/common/email/email.service";
import { UpdateTeacherDto } from "./dto/update.dto";
export declare class TeachersService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
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
