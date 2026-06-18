import { Status } from '@prisma/client';
export declare class UpdateCourseDto {
    name: string;
    description: string;
    price: number;
    duration_month: number;
    duration_hours: number;
    status?: Status;
}
