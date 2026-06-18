"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const email_service_1 = require("../../common/email/email.service");
const sms_1 = require("../../common/services/sms");
let StudentsService = class StudentsService {
    prisma;
    emailService;
    smsService;
    constructor(prisma, emailService, smsService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.smsService = smsService;
    }
    async getMyGroups(currentUser) {
        const myGroups = await this.prisma.studentGroup.findMany({
            where: {
                student_id: currentUser.id,
            },
            select: {
                groups: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        start_date: true,
                        week_day: true,
                        start_time: true,
                        courses: {
                            select: {
                                name: true,
                                duration_hours: true,
                            }
                        },
                        _count: {
                            select: {
                                groupTeachers: true,
                            }
                        },
                        groupTeachers: {
                            select: {
                                teacher: {
                                    select: {
                                        id: true,
                                        full_name: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const formattedGroup = myGroups.map((el) => ({
            groupName: el.groups.name,
            courseName: el.groups.courses.name,
            teacherCount: el.groups._count.groupTeachers,
            startDate: el.groups.start_date,
            groupId: el.groups.id,
            status: el.groups.status,
            weekDay: el.groups.week_day,
            startTime: el.groups.start_time,
            teachers: el.groups.groupTeachers.map(teacher => ({
                full_name: teacher.teacher.full_name,
                week_day: el.groups.week_day,
                role: "TEACHER",
                start_time: el.groups.start_time,
                duration_hours: el.groups.courses.duration_hours,
            }))
        }));
        return {
            success: true,
            data: formattedGroup,
        };
    }
    async getAllStudents(pagination, search) {
        const { page, limit } = pagination;
        const { full_name, phone, status } = search;
        let searchWhere = {};
        if (status) {
            searchWhere["status"] = status;
        }
        else {
            searchWhere["status"] = "active";
        }
        if (full_name)
            searchWhere["full_name"] = full_name;
        if (phone)
            searchWhere["phone"] = phone;
        const students = await this.prisma.student.findMany({
            where: searchWhere,
            select: {
                id: true,
                full_name: true,
                phone: true,
                photo: true,
                email: true,
                address: true,
                birth_date: true,
                created_at: true,
                status: true,
                studentGroups: {
                    select: {
                        groups: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            skip: (limit ? +limit : 10) * ((page ? +page : 1) - 1),
            take: limit ? +limit : 10,
            orderBy: {
                created_at: "desc",
            },
        });
        const total = await this.prisma.student.count({
            where: searchWhere,
        });
        const formattedStudents = students.map((student) => {
            return {
                id: student.id,
                full_name: student.full_name,
                photo: student.photo,
                phone: student.phone,
                email: student.email,
                status: student.status,
                address: student.address,
                birth_date: student.birth_date,
                created_at: student.created_at,
                groups: student.studentGroups.map((group) => group.groups),
            };
        });
        return {
            success: true,
            data: formattedStudents,
            meta: {
                total,
                page: page ? +page : 1,
                limit: limit ? +limit : 10,
                totalPages: Math.ceil(total / (limit ? +limit : 10)),
            },
        };
    }
    async createStudent(payload, filename) {
        const { groups, ...rest } = payload;
        const existStudent = await this.prisma.student.findFirst({
            where: {
                OR: [{ phone: payload.phone }, { email: payload.email }],
            },
        });
        if (existStudent) {
            throw new common_1.ConflictException("Student with this phone or email already exists");
        }
        const hashPass = await bcrypt.hash(payload.password, 10);
        const student = await this.prisma.student.create({
            data: {
                full_name: payload.full_name,
                photo: filename ?? null,
                phone: payload.phone,
                birth_date: new Date(payload.birth_date),
                email: payload.email,
                password: hashPass,
                address: payload.address,
            },
        });
        if (groups && groups.length > 0) {
            const validGroups = groups.filter((id) => !isNaN(id) && id > 0);
            if (validGroups.length > 0) {
                await this.prisma.studentGroup.createMany({
                    data: validGroups.map((group_id) => ({
                        student_id: student.id,
                        group_id,
                    })),
                });
            }
        }
        await this.smsService.sendSms(payload.phone, `NajotEdu kabinetingiz https://najotedu.softwareengineer.uz/login.\n Login: ${payload.phone} Parol: ${payload.password}`);
        return {
            success: true,
            message: "Student created successfully. Login credentials sent to phone number.",
            data: {
                id: student.id,
                full_name: student.full_name,
                email: student.email,
                phone: student.phone,
                groups: groups ?? []
            },
        };
    }
    async getStudentById(id) {
        const student = await this.prisma.student.findUnique({
            where: { id, status: client_1.StudentStatus.active },
            select: {
                id: true,
                full_name: true,
                phone: true,
                photo: true,
                email: true,
                address: true,
                birth_date: true,
                studentGroups: {
                    where: { status: client_1.Status.active },
                    include: {
                        groups: {
                            include: {
                                courses: true,
                                rooms: true,
                            },
                        },
                    },
                },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException("Student not found");
        }
        return {
            success: true,
            data: student,
        };
    }
    async updateStudent(id, payload, filename) {
        const { status, groups, ...rest } = payload;
        const student = await this.prisma.student.findUnique({
            where: { id },
        });
        if (!student) {
            throw new common_1.NotFoundException("Student not found");
        }
        const updateData = {};
        if (payload.full_name)
            updateData.full_name = payload.full_name;
        if (payload.email)
            updateData.email = payload.email;
        if (payload.phone)
            updateData.phone = payload.phone;
        if (payload.address)
            updateData.address = payload.address;
        if (payload.status)
            updateData.status = payload.status;
        if (payload.birth_date)
            updateData.birth_date = new Date(payload.birth_date);
        if (filename)
            updateData.photo = filename;
        if (payload.password) {
            updateData.password = await bcrypt.hash(payload.password, 10);
        }
        const updatedStudent = await this.prisma.student.update({
            where: { id },
            data: updateData,
        });
        if (groups && Array.isArray(groups)) {
            await this.prisma.studentGroup.deleteMany({ where: { student_id: id } });
            const validGroups = groups.filter((gId) => !isNaN(gId) && gId > 0);
            if (validGroups.length > 0) {
                await this.prisma.studentGroup.createMany({
                    data: validGroups.map((group_id) => ({ student_id: id, group_id })),
                });
            }
        }
        return {
            success: true,
            message: "Student updated successfully",
            data: updatedStudent,
        };
    }
    async toggleStatus(id, status) {
        const student = await this.prisma.student.findUnique({ where: { id } });
        if (!student)
            throw new common_1.NotFoundException(`Student topilmadi`);
        return this.prisma.student.update({
            where: { id },
            data: { status },
        });
    }
    async deleteStudent(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
        });
        if (!student) {
            throw new common_1.NotFoundException("Student not found");
        }
        const deletedStudent = await this.prisma.student.update({
            where: { id },
            data: { status: client_1.StudentStatus.inactive },
        });
        if (student.photo) {
            const fs = require("fs");
            const path = `./src/uploads/${student.photo}`;
            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
            }
        }
        return {
            success: true,
            message: "Student deleted successfully",
        };
    }
    async searchStudents(search) {
        const students = await this.prisma.student.findMany({
            where: {
                status: client_1.StudentStatus.active,
                full_name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                full_name: true,
                phone: true,
                email: true,
                photo: true,
            },
            take: 10,
        });
        return {
            success: true,
            data: students,
        };
    }
    async createHomeworkAnswer(homeworkId, currentUser, payload, filenames = []) {
        const existHomework = await this.prisma.homework.findFirst({
            where: {
                id: homeworkId,
            }
        });
        if (!existHomework) {
            throw new common_1.NotFoundException("Homework not found with this id");
        }
        const existHomeworkAnswer = await this.prisma.homeworkAnswerStudent.findFirst({
            where: {
                homework_id: homeworkId,
                student_id: currentUser.id,
            }
        });
        if (existHomeworkAnswer) {
            throw new common_1.ConflictException("You have already answered this homework");
        }
        await this.prisma.homeworkAnswerStudent.create({
            data: {
                homework_id: homeworkId,
                student_id: currentUser.id,
                title: payload.title,
                file: filenames.length ? JSON.stringify(filenames) : null,
            }
        });
        return {
            success: true,
            message: "Homework answer recorded"
        };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        sms_1.EskizService])
], StudentsService);
//# sourceMappingURL=students.service.js.map