import { HomeworkService } from "./homework.service";
import { CreateHomeworkDto } from "./dto/create.dto";
import { HomeworkStatus } from "@prisma/client";
import { HomeworkResultDto } from "./dto/homework.result.dto";
export declare class HomeworkController {
    private readonly homeworkService;
    constructor(homeworkService: HomeworkService);
    getOwnHomework(lessonId: number, req: Request): Promise<{
        success: boolean;
        data: ({
            id: number;
            title: string;
            file: string | null;
            created_at: Date;
            update_at: Date;
            user: {
                id: number;
                phone: string;
                photo: string | null;
                first_name: string;
                last_name: string;
            } | null;
            teacher?: undefined;
        } | {
            id: number;
            title: string;
            file: string | null;
            created_at: Date;
            update_at: Date;
            teacher: {
                id: number;
                full_name: string;
                phone: string;
                photo: string | null;
            };
            user?: undefined;
        })[];
    }>;
    getHomeworkResults(status: HomeworkStatus, groupId: number, homeworkId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            full_name: string;
        }[];
    }>;
    getGroupHomeworkStudentResult(groupId: number, homeworkId: number, studentId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            title: string;
            file: string | null;
            created_at: Date;
            students: {
                id: number;
                full_name: string;
            };
        } | null;
    }>;
    getAllHomework(): Promise<{
        success: boolean;
        data: {
            id: number;
            teacher_id: number | null;
            user_id: number | null;
            lesson_id: number;
            group_id: number;
            title: string;
            file: string | null;
            created_at: Date;
            update_at: Date;
        }[];
    }>;
    createHomework(req: Request, payload: CreateHomeworkDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    checkHomeworkResult(groupId: number, homeworkId: number, payload: HomeworkResultDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    getGroupHomework(groupId: number, req: Request): Promise<{
        success: boolean;
        data: {
            groupFormated: {
                id: number;
                topic: string;
                created_at: Date;
                homework: {
                    id: number;
                    title: string;
                    file: string | null;
                    created_at: Date;
                    student_count: number;
                    homeworkPending: number;
                    homeworkAccepted: number;
                }[];
            }[];
            homeworkPending: number;
            homeworkAccepted: number;
            existStudentInGroup: number;
        };
    }>;
}
