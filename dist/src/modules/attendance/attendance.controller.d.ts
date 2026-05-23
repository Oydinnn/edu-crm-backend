import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    getAllAttendance(): Promise<{
        seccess: boolean;
        data: {
            id: number;
            created_at: Date;
            update_at: Date;
            student_id: number;
            teacher_id: number | null;
            isPresent: boolean;
            user_id: number | null;
            lesson_id: number;
        }[];
    }>;
    createAttendance(payload: CreateAttendanceDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
