"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworkService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const client_1 = require("@prisma/client");
let HomeworkService = class HomeworkService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOwnHomework(lessonId, currentUser) {
        const myLessons = await this.prisma.homework.findMany({
            where: {
                lesson_id: lessonId,
            },
            select: {
                id: true,
                title: true,
                file: true,
                created_at: true,
                update_at: true,
                teachers: {
                    select: {
                        id: true,
                        full_name: true,
                        phone: true,
                        photo: true,
                    },
                },
                users: {
                    select: {
                        id: true,
                        last_name: true,
                        first_name: true,
                        phone: true,
                        photo: true,
                    },
                },
            },
        });
        const homeworkFormated = myLessons.map((el) => {
            if (!el.teachers) {
                return {
                    id: el.id,
                    title: el.title,
                    file: el.file,
                    created_at: el.created_at,
                    update_at: el.update_at,
                    user: el.users,
                };
            }
            else {
                return {
                    id: el.id,
                    title: el.title,
                    file: el.file,
                    created_at: el.created_at,
                    update_at: el.update_at,
                    teacher: el.teachers,
                };
            }
        });
        return {
            success: true,
            data: homeworkFormated,
        };
    }
    async getAllHomework() {
        const homeworks = await this.prisma.homework.findMany();
        return {
            success: true,
            data: homeworks,
        };
    }
    async createHomework(payload, currentUser, filename) {
        const existLesson = await this.prisma.lesson.findFirst({
            where: {
                id: payload.lesson_id,
            },
            select: {
                groups: {
                    select: {
                        groupTeachers: {
                            select: {
                                teacher_id: true,
                            },
                        },
                    },
                },
            },
        });
        if (!existLesson) {
            throw new common_1.NotFoundException("Lesson not fount with this id");
        }
        const isTeacherOfGroup = existLesson?.groups.groupTeachers.some((gt) => gt.teacher_id === currentUser.id);
        if (currentUser.role == client_1.Role.TEACHER && !isTeacherOfGroup) {
            throw new common_1.ForbiddenException("This lesson is not assigned to you");
        }
        await this.prisma.homework.create({
            data: {
                ...payload,
                file: filename,
                teacher_id: currentUser.role == "TEACHER" ? currentUser.id : null,
                user_id: currentUser.role != "TEACHER" ? currentUser.id : null,
            },
        });
        return {
            success: true,
            message: "Homework recorded",
        };
    }
    async getGroupHomework(groupId, currentUser) {
        const group = await this.prisma.group.findFirst({
            where: {
                id: groupId,
            },
        });
        if (!group) {
            throw new common_1.NotFoundException("Group not found with this id");
        }
        const homeworks = await this.prisma.homework.findMany({
            where: {
                group_id: groupId,
            },
            orderBy: {
                created_at: "desc",
            },
            select: {
                id: true,
                title: true,
                file: true,
                created_at: true,
                lesson_id: true,
                lesson: {
                    select: {
                        id: true,
                        topic: true,
                        created_at: true,
                    },
                },
                homeworkAnswerStudents: {
                    select: {
                        id: true,
                        homeworkStatus: true,
                    },
                },
            },
        });
        const existStudentInGroup = await this.prisma.studentGroup.count({
            where: {
                group_id: groupId,
            },
        });
        const groupFormated = homeworks.map((el) => {
            const pendingCount = el.homeworkAnswerStudents.filter((ans) => ans.homeworkStatus === client_1.HomeworkStatus.PENDING).length;
            const checkedCount = el.homeworkAnswerStudents.filter((ans) => ans.homeworkStatus === client_1.HomeworkStatus.CHECKED).length;
            return {
                id: el.lesson?.id ?? el.lesson_id,
                topic: el.lesson?.topic ?? el.title,
                created_at: el.lesson?.created_at ?? el.created_at,
                homework: [
                    {
                        id: el.id,
                        title: el.title,
                        file: el.file,
                        created_at: el.created_at,
                        student_count: existStudentInGroup,
                        homeworkPending: pendingCount,
                        homeworkAccepted: checkedCount,
                    },
                ],
            };
        });
        return {
            success: true,
            data: {
                groupFormated,
                homeworkPending: 0,
                homeworkAccepted: 0,
                existStudentInGroup,
            },
        };
    }
    async getHomeworkResults(groupId, homeworkId, status) {
        if (status == client_1.HomeworkStatus.PENDING || status == client_1.HomeworkStatus.CHECKED) {
            const studentResults = await this.prisma.homeworkAnswerStudent.findMany({
                where: {
                    homeworkStatus: status,
                    homework_id: homeworkId,
                },
                orderBy: {
                    created_at: "desc",
                },
                select: {
                    created_at: true,
                    students: {
                        select: {
                            id: true,
                            full_name: true,
                        },
                    },
                },
            });
            return {
                success: true,
                data: studentResults.map((el) => ({
                    ...el.students,
                    sent_at: el.created_at,
                })),
            };
        }
        else if (status == client_1.HomeworkStatus.ACCEPTED ||
            status == client_1.HomeworkStatus.REJECTED) {
            const studentResults = await this.prisma.homeworkResult.findMany({
                where: {
                    homework_id: homeworkId,
                    group_id: groupId,
                    homeworkStatus: status,
                },
                orderBy: {
                    created_at: "desc",
                },
                select: {
                    homeworkAnswerStudent: {
                        select: {
                            created_at: true,
                            students: {
                                select: {
                                    id: true,
                                    full_name: true,
                                },
                            },
                        },
                    },
                },
            });
            return {
                success: true,
                data: studentResults.map((el) => ({
                    ...el.homeworkAnswerStudent.students,
                    sent_at: el.homeworkAnswerStudent.created_at,
                })),
            };
        }
        const studentIds = await this.prisma.studentGroup.findMany({
            where: {
                group_id: groupId,
            },
            select: {
                student_id: true,
            },
        });
        const allStudentIds = studentIds.map((el) => el.student_id);
        const topshirganTalabalar = await this.prisma.homeworkAnswerStudent.findMany({
            where: {
                homework_id: homeworkId,
            }
        });
        let topshirganTalabalarIds = topshirganTalabalar.map((el) => el.student_id);
        const topshirmaganTalabalar = await this.prisma.studentGroup.findMany({
            where: {
                group_id: groupId,
                student_id: {
                    notIn: topshirganTalabalarIds,
                },
            },
            include: {
                students: {
                    select: {
                        id: true,
                        full_name: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: topshirmaganTalabalar.map((el) => el.students),
        };
    }
    async getGroupHomeworkStudentResult(groupId, homeworkId, studentId) {
        const studentResult = await this.prisma.homeworkAnswerStudent.findFirst({
            where: {
                homework_id: homeworkId,
                student_id: studentId,
            },
            select: {
                id: true,
                title: true,
                file: true,
                created_at: true,
                students: {
                    select: {
                        id: true,
                        full_name: true,
                    },
                },
            },
        });
        const homework = await this.prisma.homework.findFirst({
            where: {
                id: homeworkId,
            },
            select: {
                id: true,
                title: true,
                file: true,
                created_at: true,
            }
        });
        const answer = await this.prisma.homeworkAnswerStudent.findFirst({
            where: {
                homework_id: homeworkId,
                student_id: studentId,
            },
            select: {
                homeworkStatus: true,
                homeworkResults: {
                    orderBy: {
                        created_at: "desc",
                    },
                    select: {
                        id: true,
                        grade: true,
                        title: true,
                        created_at: true,
                        homeworkStatus: true,
                        teachers: {
                            select: {
                                id: true,
                                full_name: true,
                            },
                        },
                        users: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                            },
                        },
                    },
                },
            },
        });
        const statusLabelMap = {
            [client_1.HomeworkStatus.PENDING]: "kutilmoqda",
            [client_1.HomeworkStatus.ACCEPTED]: "qabul qilingan",
            [client_1.HomeworkStatus.REJECTED]: "qaytarilgan",
            [client_1.HomeworkStatus.CHECKED]: "tekshirilgan",
        };
        let status = "berilmagan";
        const latestResult = answer?.homeworkResults?.[0] || null;
        if (answer) {
            const resultStatus = latestResult?.homeworkStatus;
            const currentStatus = resultStatus || answer.homeworkStatus;
            status = currentStatus ? statusLabelMap[currentStatus] || "berilmagan" : "kutilmoqda";
        }
        return {
            success: true,
            data: {
                ...(studentResult || {}),
                homework,
                status,
                homeworkResult: latestResult,
            },
        };
    }
    async checkHomeworkResult(groupId, homeworkId, payload, currentUser) {
        await this.prisma.homeworkResult.create({
            data: {
                homework_answer_id: payload.homework_answer_id,
                group_id: groupId,
                homework_id: homeworkId,
                grade: payload.grade,
                title: payload.title,
                teacher_id: currentUser.role == client_1.Role.TEACHER ? currentUser.id : null,
                user_id: currentUser.role != client_1.Role.TEACHER ? currentUser.id : null,
                homeworkStatus: payload.grade >= 60 ? client_1.HomeworkStatus.ACCEPTED : client_1.HomeworkStatus.REJECTED,
            },
        });
        await this.prisma.homeworkAnswerStudent.update({
            where: {
                id: payload.homework_answer_id,
            },
            data: {
                homeworkStatus: client_1.HomeworkStatus.CHECKED,
            },
        });
        return {
            success: true,
            message: "Homework checked",
        };
    }
};
exports.HomeworkService = HomeworkService;
exports.HomeworkService = HomeworkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomeworkService);
//# sourceMappingURL=homework.service.js.map