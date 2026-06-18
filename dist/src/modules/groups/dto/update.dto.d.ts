import { WeekDay } from "@prisma/client";
import { GroupStatus } from "@prisma/client";
export declare class UpdateGroupDto {
    name?: string;
    description?: string;
    course_id?: number;
    room_id?: number;
    start_date?: string;
    week_day?: WeekDay[];
    start_time?: string;
    max_student?: number;
    teachers?: number[];
    students?: number[];
    status?: GroupStatus;
}
