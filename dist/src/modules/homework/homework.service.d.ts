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
                first_name: string;
                last_name: string;
                phone: string;
                id: number;
                photo: string | null;
            } | null;
            teacher?: undefined;
        } | {
            id: number;
            title: string;
            file: string | null;
            created_at: Date;
            update_at: Date;
            teacher: {
                phone: string;
                id: number;
                photo: string | null;
                full_name: string;
            };
            user?: undefined;
        })[];
    }>;
    getAllHomework(): Promise<{
        success: boolean;
        data: {
            id: number;
            created_at: Date;
            update_at: Date;
            title: string;
            file: string | null;
            group_id: number;
            teacher_id: number | null;
            user_id: number | null;
            lesson_id: number;
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
            students: {
                id: number;
                full_name: string;
            };
            title: string;
            file: string | null;
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
