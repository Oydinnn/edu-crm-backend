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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../core/database/prisma.service");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllAttendance() {
        const attendances = await this.prisma.attendance.findMany();
        return {
            seccess: true,
            data: attendances,
        };
    }
    async createAttendance(payload, currentUser) {
        const week = {
            "1": "MONDAY",
            "2": "TUESDAY",
            "3": "WEDNESDAY",
            "4": "THURSDAY",
            "5": "FRIDAY",
            "6": "SATURDAY",
            "7": "SUNDAY",
        };
        const lessonGroup = await this.prisma.lesson.findFirst({
            where: {
                id: payload.lesson_id,
            },
            select: {
                created_at: true,
                groups: {
                    select: {
                        start_time: true,
                        start_date: true,
                        groupTeachers: {
                            select: {
                                teacher_id: true,
                            },
                        },
                        week_day: true,
                        courses: {
                            select: {
                                duration_hours: true,
                            },
                        },
                        studentGroups: {
                            where: {
                                student_id: payload.student_id,
                                status: client_1.Status.active,
                            },
                        },
                    },
                },
            },
        });
        if (!lessonGroup?.groups.studentGroups.length) {
            throw new common_1.BadRequestException("Student not found whth this group");
        }
        const isTeacherOfGroup = lessonGroup?.groups.groupTeachers.some((gt) => gt.teacher_id === currentUser.id);
        if (currentUser.role == client_1.Role.TEACHER && !isTeacherOfGroup) {
            throw new common_1.ForbiddenException("This lesson is not assigned to you");
        }
        const week_day = lessonGroup?.groups.week_day;
        const nowDate = new Date();
        const day = nowDate.getDay();
        if (!week_day?.includes(week[day])) {
            throw new common_1.BadRequestException("Dars vaqti xali boshlanmadi");
        }
        const timeToMinutes = (time) => {
            const [h, m] = time.split(":").map(Number);
            return h * 60 + m;
        };
        const startMinute = timeToMinutes(lessonGroup.groups.start_time);
        const endMinute = startMinute + lessonGroup.groups.courses.duration_hours * 60;
        const nowMinute = nowDate.getHours() * 60 + nowDate.getMinutes();
        if (!(lessonGroup.created_at.getTime() < Date.now()) &&
            startMinute > nowMinute) {
            throw new common_1.BadRequestException("Dars hali boshlanmadi");
        }
        if (!(startMinute < nowMinute && endMinute > nowMinute) &&
            currentUser.role == client_1.Role.TEACHER) {
            throw new common_1.BadRequestException("Dars vaqtidan tashqarida davomat qilib bo'lmaydi");
        }
        await this.prisma.attendance.create({
            data: {
                ...payload,
                teacher_id: currentUser.role == "TEACHER" ? currentUser.id : null,
                user_id: currentUser.role != "TEACHER" ? currentUser.id : null,
            },
        });
        return {
            success: true,
            message: "Attendance recorded",
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map