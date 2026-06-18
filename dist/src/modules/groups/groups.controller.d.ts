import { GroupsService } from "./groups.service";
import { CreateGroupDto } from "./dto/create.dto";
import { GroupStatus } from "@prisma/client";
import { filterDto } from "./dto/search";
import { UpdateGroupDto } from "./dto/update.dto";
import { CreateLessonDto } from "../lessons/dto/create.lesson.dto";
export declare class GroupsController {
    private readonly groupService;
    constructor(groupService: GroupsService);
    getLessonsByGroupId(groupId: number, req: Request): Promise<{
        id: number;
        topic: string;
        created_at: Date;
        homework_id: number | null;
        videoCount: number;
    }[]>;
    getLessons(groupId: number, req: Request): Promise<any>;
    getGroupOne(groupId: number): Promise<{
        success: boolean;
        data: {
            phone: string;
            email: string;
            id: number;
            photo: string | null;
            created_at: Date;
            full_name: string;
            birth_date: Date;
        }[];
    }>;
    getAllGroups(search: filterDto): Promise<{
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
            teachers: {
                id: number;
                full_name: string;
            }[];
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
    getGroupById(groupId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            status: import("@prisma/client").$Enums.GroupStatus;
            start_date: Date;
            start_time: string;
            week_day: string[];
            max_student: number;
            description: string | null;
            teachers: {
                phone: string;
                id: number;
                photo: string | null;
                full_name: string;
            }[];
            students: {
                id: number;
                full_name: string;
            }[];
            course: {
                id: number;
                name: string;
                duration_month: number;
            };
            course_duration_month: number;
            room: string | null;
            room_capacity: number | null;
            student_count: number;
            students_avg_age: string;
        };
    }>;
    createGroup(payload: CreateGroupDto): Promise<{
        success: boolean;
        message: string;
        data: {
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
    }>;
    updateGroup(id: number, payload: UpdateGroupDto): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleStatus(id: number, status: GroupStatus): Promise<{
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
    }>;
    deleteGroup(id: number): Promise<{
        message: string;
    }>;
    getschedules(groupId: number, req: Request): Promise<{}[]>;
    createLesson(groupId: number, payload: CreateLessonDto, date: string): Promise<{
        success: boolean;
        message: string;
        data: {
            lesson: {
                id: number;
                topic: string;
                description: string | null;
                created_at: Date;
            };
            attendance: {
                student_id: number;
                full_name: string;
                photo: string | null;
                isPresent: boolean;
            }[];
        };
    }>;
    getLessonByDate(groupId: number, date: string): Promise<{
        success: boolean;
        data: {
            lesson: {
                id: number;
                topic: string;
                description: string | null;
                created_at: Date;
            } | null;
            attendance: {
                student_id: number;
                full_name: string;
                photo: string | null;
                isPresent: boolean;
            }[];
        };
    }>;
}
