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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const client_1 = require("@prisma/client");
let LessonsService = class LessonsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLessonHomeworks(groupId, lessonId, currentUser) {
        const existStudent = await this.prisma.studentGroup.findFirst({
            where: {
                student_id: currentUser.id,
                group_id: groupId,
            },
        });
        if (!existStudent) {
            throw new common_1.NotFoundException("You are not a student of this group");
        }
        const existLesson = await this.prisma.lesson.findFirst({
            where: {
                id: lessonId,
                group_id: groupId,
                status: client_1.Status.active,
            },
        });
        if (!existLesson) {
            throw new common_1.NotFoundException("Lesson not found with this id");
        }
        const lessonHomeworks = await this.prisma.homework.findMany({
            where: {
                lesson_id: lessonId,
                group_id: groupId,
            },
            select: {
                id: true,
                title: true,
                file: true,
                created_at: true,
            },
        });
        if (!lessonHomeworks) {
            return {
                success: true,
                data: [],
            };
        }
        const studentHomeworkAnswer = await this.prisma.homeworkAnswerStudent.findFirst({
            where: {
                student_id: currentUser.id,
                homework_id: lessonHomeworks[0].id,
            },
            select: {
                id: true,
                file: true,
                title: true,
                created_at: true,
            },
        });
        if (!studentHomeworkAnswer) {
            return {
                success: true,
                data: {
                    homework: lessonHomeworks[0],
                    studentAnswer: null,
                    homeworkResult: null
                },
            };
        }
        const homeworkResult = await this.prisma.homeworkResult.findFirst({
            where: {
                homework_answer_id: studentHomeworkAnswer.id,
            },
            select: {
                id: true,
                grade: true,
                title: true,
                created_at: true,
                teachers: {
                    select: {
                        full_name: true
                    }
                },
                users: {
                    select: {
                        first_name: true,
                        last_name: true,
                    }
                }
            },
        });
        if (!homeworkResult) {
            return {
                success: true,
                data: {
                    homeworks: lessonHomeworks,
                    studentAnswer: studentHomeworkAnswer,
                },
            };
        }
        else {
            return {
                success: true,
                data: {
                    homeworks: lessonHomeworks[0],
                    studentAnswer: studentHomeworkAnswer,
                    homeworkResult: homeworkResult
                },
            };
        }
    }
    async getLessonVideos(groupId, lessonId, currentUser) {
        const existLesson = await this.prisma.lesson.findFirst({
            where: {
                id: lessonId,
                group_id: groupId,
                status: client_1.Status.active,
            },
        });
        if (!existLesson) {
            throw new common_1.NotFoundException("Lesson not found with this id");
        }
        const lessonVideos = await this.prisma.lessonVideo.findMany({
            where: {
                lesson_id: lessonId,
            },
            select: {
                id: true,
                video_url: true,
                originalname: true,
                created_at: true,
            },
        });
        return {
            success: true,
            data: lessonVideos,
        };
    }
    async getMyGroupLessons(groupId, currentUser) {
        const existGroup = await this.prisma.group.findFirst({
            where: {
                id: groupId,
                status: client_1.Status.active,
            },
        });
        if (!existGroup) {
            throw new common_1.NotFoundException("Group not found with this id");
        }
        const groupLessons = await this.prisma.lesson.findMany({
            where: {
                group_id: groupId,
                status: client_1.Status.active,
            },
            select: {
                id: true,
                topic: true,
                created_at: true,
            },
        });
        return {
            success: true,
            data: groupLessons,
        };
    }
    async getAllLessons() {
        const lessons = await this.prisma.lesson.findMany({
            where: { status: "active" },
        });
        return {
            sucess: true,
            data: lessons,
        };
    }
    async createLesson(payload, currentUser) {
        const existGroup = await this.prisma.group.findFirst({
            where: {
                id: payload.group_id,
                status: client_1.Status.active,
            },
            select: {
                groupTeachers: {
                    select: {
                        teacher_id: true
                    }
                }
            }
        });
        if (!existGroup) {
            throw new common_1.NotFoundException("Group not found with this id");
        }
        const isTeacherOfGroup = existGroup?.groupTeachers.some((gt) => gt.teacher_id === currentUser.id);
        if (currentUser.role == client_1.Role.TEACHER && !isTeacherOfGroup) {
            throw new common_1.ForbiddenException("This lesson is not assigned to you");
        }
        const { attendances, ...lessonPayload } = payload;
        const attendancesNested = attendances
            ? {
                attendances: {
                    create: attendances.map((a) => ({
                        student_id: a.student_id,
                        isPresent: a.isPresent,
                        teacher_id: currentUser.role == client_1.Role.TEACHER ? currentUser.id : null,
                        user_id: currentUser.role != client_1.Role.TEACHER ? currentUser.id : null,
                    })),
                },
            }
            : {};
        await this.prisma.lesson.create({
            data: {
                ...lessonPayload,
                teacher_id: currentUser.role == client_1.Role.TEACHER ? currentUser.id : null,
                user_id: currentUser.role != client_1.Role.TEACHER ? currentUser.id : null,
                ...attendancesNested,
            },
        });
        return {
            success: true,
            message: "Lesson created",
        };
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map