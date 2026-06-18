import { StudentStatus } from "@prisma/client";
export declare class UpdateStudentDto {
    full_name?: string;
    password?: string;
    phone?: string;
    email?: string;
    birth_date?: string;
    address?: string;
    status?: StudentStatus;
    groups?: number[];
}
