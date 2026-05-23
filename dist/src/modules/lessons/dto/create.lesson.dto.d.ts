export declare class AttendanceDto {
    student_id: number;
    isPresent: boolean;
}
export declare class CreateLessonDto {
    group_id?: number;
    topic: string;
    description?: string;
    attendances?: AttendanceDto[];
}
