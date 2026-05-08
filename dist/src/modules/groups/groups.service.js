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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const client_1 = require("@prisma/client");
let GroupsService = class GroupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGroupOne(groupId) {
        const existGroup = await this.prisma.group.findFirst({
            where: {
                id: groupId,
                status: client_1.Status.active
            }
        });
        if (!existGroup) {
            throw new common_1.NotFoundException("Group not found with this id");
        }
        const groupStudents = await this.prisma.studentGroup.findMany({
            where: {
                group_id: groupId,
                status: client_1.Status.active
            },
            select: {
                students: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        phone: true,
                        email: true,
                        photo: true,
                        birth_date: true,
                        created_at: true
                    }
                }
            }
        });
        const dataFormatter = groupStudents.map(el => el.students);
        return {
            success: true,
            data: dataFormatter
        };
    }
    async getAllGroups(search) {
        const { groupName, max_student } = search;
        let searchWhere = {
            status: client_1.Status.active,
        };
        if (groupName) {
            searchWhere["name"] = groupName;
        }
        if (max_student) {
            searchWhere["max_student"] = +max_student;
        }
        const groups = await this.prisma.group.findMany({
            where: searchWhere,
            select: {
                id: true,
                name: true,
                max_student: true,
                start_date: true,
                start_time: true,
                week_day: true,
                courses: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                rooms: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                groupTeachers: {
                    select: {
                        teacher: {
                            select: {
                                full_name: true
                            }
                        }
                    }
                },
            }
        });
        return {
            success: true,
            data: groups
        };
    }
    async createGroup(payload) {
        const timeToMinutes = (time) => {
            const [h, m] = time.split(":").map(Number);
            return h * 60 + m;
        };
        const existRoom = await this.prisma.room.findFirst({
            where: {
                id: payload.room_id,
                status: client_1.Status.active
            }
        });
        if (!existRoom) {
            throw new common_1.NotFoundException("Room is not found with this id");
        }
        const existCourse = await this.prisma.course.findFirst({
            where: {
                id: payload.course_id,
                status: client_1.Status.active
            }
        });
        if (!existCourse) {
            throw new common_1.NotFoundException("Course is not found or inactive with this id");
        }
        let teachers = Array();
        if (payload.teachers?.length) {
            teachers = await this.prisma.teacher.findMany({
                where: { id: { in: payload.teachers } },
                select: { id: true }
            });
            if (teachers.length !== payload.teachers?.length) {
                throw new common_1.NotFoundException('Teacherlardan biri topilmadi');
            }
        }
        let students = Array();
        if (payload.students?.length) {
            students = await this.prisma.student.findMany({
                where: { id: { in: payload.students } },
                select: { id: true }
            });
            if (students.length !== payload.students?.length) {
                throw new common_1.NotFoundException('Studentlardan biri topilmadi');
            }
        }
        const existGroup = await this.prisma.group.findUnique({
            where: { name: payload.name }
        });
        if (existGroup) {
            throw new common_1.ConflictException("Group already exists");
        }
        const startNew = timeToMinutes(payload.start_time);
        const endNew = startNew + existCourse.duration_hours * 60;
        const roomGroups = await this.prisma.group.findMany({
            where: {
                room_id: payload.room_id,
                status: client_1.Status.active
            },
            select: {
                start_time: true,
                courses: {
                    select: {
                        duration_hours: true
                    }
                }
            }
        });
        const isRoomBusy = roomGroups.some(el => {
            const start = timeToMinutes(el.start_time);
            const end = start + el.courses.duration_hours * 60;
            return start < endNew && end > startNew;
        });
        if (isRoomBusy) {
            throw new common_1.ConflictException("Room is busy at this time");
        }
        const newGroup = await this.prisma.group.create({
            data: {
                name: payload.name,
                description: payload.description,
                course_id: payload.course_id,
                room_id: payload.room_id,
                start_time: payload.start_time,
                max_student: payload.max_student,
                week_day: payload.week_day,
                start_date: new Date(payload.start_date),
                groupTeachers: payload.teachers?.length ? {
                    create: payload.teachers?.map((id) => ({
                        teacher_id: id
                    }))
                } : undefined,
                studentGroups: payload.students?.length ? {
                    create: payload.students?.map((id) => ({
                        student_id: id
                    }))
                } : undefined
            }
        });
        return {
            success: true,
            message: "Group created successfully",
            data: newGroup
        };
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map