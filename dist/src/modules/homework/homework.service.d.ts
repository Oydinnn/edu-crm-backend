import { PrismaService } from "src/core/database/prisma.service";
import { CreateHomeworkDto } from "./dto/create.dto";
import { HomeworkStatus, Role } from "@prisma/client";
import { HomeworkResultDto } from "./dto/homework.result.dto";
export declare class HomeworkService {
    private prisma;
    constructor(prisma: PrismaService);
    getOwnHomework(lessonId: number, currentUser: {
        id: number;
    }): Promise<{
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
    createHomework(payload: CreateHomeworkDto, currentUser: {
        id: number;
        role: Role;
    }, filename?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getGroupHomework(groupId: number, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
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
    getHomeworkResults(groupId: number, homeworkId: number, status?: HomeworkStatus): Promise<{
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
    checkHomeworkResult(groupId: number, homeworkId: number, payload: HomeworkResultDto, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
