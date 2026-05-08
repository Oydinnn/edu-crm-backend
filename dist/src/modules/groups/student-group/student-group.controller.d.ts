import { StudentGroupService } from './student-group.service';
import { CreateStudentGroupDto } from './dto/create.dto';
export declare class StudentGroupController {
    private readonly studentGroupService;
    constructor(studentGroupService: StudentGroupService);
    getAllStudentGroup(): Promise<{
        sucess: boolean;
        data: {
            id: number;
            status: import("@prisma/client").$Enums.Status;
            created_at: Date;
            update_at: Date;
            student_id: number;
            group_id: number;
        }[];
    }>;
    createStudentGroup(payload: CreateStudentGroupDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
