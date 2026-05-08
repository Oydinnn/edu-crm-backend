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
};
exports.HomeworkService = HomeworkService;
exports.HomeworkService = HomeworkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomeworkService);
//# sourceMappingURL=homework.service.js.map