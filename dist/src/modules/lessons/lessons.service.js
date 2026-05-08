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
        const existGroupStudent = await this.prisma.studentGroup.findFirst({
            where: {
                group_id: groupId,
                student_id: currentUser.id,
                status: client_1.Status.active,
            },
        });
        if (!existGroupStudent) {
            throw new common_1.BadRequestException("Group does not belong to this Student");
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
        await this.prisma.lesson.create({
            data: {
                ...payload,
                teacher_id: currentUser.role == "TEACHER" ? currentUser.id : null,
                user_id: currentUser.role != "TEACHER" ? currentUser.id : null,
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