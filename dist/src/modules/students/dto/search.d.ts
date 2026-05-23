import { StudentStatus } from "@prisma/client";
export declare class filterDto {
    full_name: string;
    phone: string;
    status?: StudentStatus;
}
