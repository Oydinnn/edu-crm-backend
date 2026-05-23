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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const email_service_1 = require("../../common/email/email.service");
const client_1 = require("@prisma/client");
const generate_password_1 = require("../../common/utills/generate-password");
let TeachersService = class TeachersService {
    prisma;
    emailService;
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async getAllTeachers() {
        const teachers = await this.prisma.teacher.findMany({
            where: {
                status: client_1.Status.active,
            },
            select: {
                id: true,
                full_name: true,
                phone: true,
                photo: true,
                email: true,
                address: true,
                created_at: true,
                groupTeachers: {
                    select: {
                        group: { select: { id: true, name: true } },
                    },
                },
            },
        });
        const formatedTeachers = teachers.map((el) => {
            let photoUrl = '';
            if (el.photo) {
                photoUrl = `/files/${el.photo}`;
            }
            return {
                id: el.id,
                full_name: el.full_name,
                phone: el.phone,
                photo: photoUrl,
                email: el.email,
                address: el.address,
                created_at: el.created_at,
                groups: el.groupTeachers.map((gt) => gt.group)
            };
        });
        return {
            success: true,
            data: formatedTeachers,
        };
    }
    async createTeacher(payload, filename) {
        const existTeacher = await this.prisma.teacher.findFirst({
            where: {
                OR: [{ phone: payload.phone }, { email: payload.email }],
            },
        });
        if (existTeacher) {
            if (filename) {
                fs.unlinkSync(`src/uploads/${filename}`);
            }
            throw new common_1.ConflictException("Teacher with this phone or email already exists");
        }
        let existingGroups = [];
        if (payload.groups?.length) {
            existingGroups = await this.prisma.group.findMany({
                where: { id: { in: payload.groups } },
                select: { id: true },
            });
            if (existingGroups.length !== payload.groups.length) {
                const foundIds = existingGroups.map((g) => g.id);
                const missingIds = payload.groups.filter((id) => !foundIds.includes(id));
                throw new common_1.NotFoundException(`Guruhlar topilmadi: ${missingIds.join(", ")}`);
            }
        }
        const plainPassword = (0, generate_password_1.generateRandomPassword)(10);
        const hashPass = await bcrypt.hash(plainPassword, 10);
        let emailError = null;
        try {
            await this.emailService.sendTeacherCredentials(payload.email, payload.phone, plainPassword, payload.full_name);
        }
        catch (emailError) {
            if (filename) {
                fs.unlinkSync(`src/uploads/${filename}`);
            }
            throw new common_1.BadRequestException({
                success: false,
                message: "Email yuborishda xatolik. Iltimos, email manzilni tekshiring.",
                error: emailError.message
            });
        }
        const newTeacher = await this.prisma.teacher.create({
            data: {
                full_name: payload.full_name,
                photo: filename ?? null,
                phone: payload.phone,
                email: payload.email,
                password: hashPass,
                address: payload.address,
                groupTeachers: payload.groups?.length
                    ? {
                        create: payload.groups.map((groupId) => ({
                            group: { connect: { id: groupId } },
                        })),
                    }
                    : undefined,
            },
        });
        return {
            success: true,
            message: "Teacher created successfully. Login credentials sent to email.",
            data: {
                id: newTeacher.id,
                full_name: newTeacher.full_name,
                phone: newTeacher.phone,
                email: newTeacher.email,
            }
        };
    }
    async updateTeacher(id, payload, photoFilename) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
            include: { groupTeachers: true }
        });
        if (!teacher)
            throw new common_1.NotFoundException("O'qituvchi topilmadi");
        let groupsArray = payload.groups;
        if (typeof payload.groups === 'string') {
            try {
                groupsArray = JSON.parse(payload.groups);
            }
            catch (e) {
                groupsArray = [];
            }
        }
        const updateData = {};
        if (payload.full_name !== undefined)
            updateData.full_name = payload.full_name;
        if (payload.email !== undefined)
            updateData.email = payload.email;
        if (payload.phone !== undefined)
            updateData.phone = payload.phone;
        if (payload.address !== undefined)
            updateData.address = payload.address;
        if (payload.password) {
            updateData.password = await bcrypt.hash(payload.password, 10);
        }
        if (photoFilename) {
            if (teacher.photo) {
                const oldPath = `./src/uploads/${teacher.photo}`;
                if (fs.existsSync(oldPath))
                    fs.unlinkSync(oldPath);
            }
            updateData.photo = photoFilename;
        }
        if (groupsArray !== undefined && Array.isArray(groupsArray)) {
            await this.prisma.groupTeacher.deleteMany({
                where: { teacher_id: id }
            });
            if (groupsArray.length > 0) {
                const existingGroups = await this.prisma.group.findMany({
                    where: { id: { in: groupsArray } }
                });
                if (existingGroups.length !== groupsArray.length) {
                    throw new common_1.NotFoundException('Ba\'zi guruhlar topilmadi');
                }
                await this.prisma.groupTeacher.createMany({
                    data: groupsArray.map(groupId => ({
                        group_id: groupId,
                        teacher_id: id
                    }))
                });
            }
        }
        const updatedTeacher = await this.prisma.teacher.update({
            where: { id },
            data: updateData,
            include: {
                groupTeachers: {
                    include: {
                        group: true
                    }
                }
            }
        });
        return {
            success: true,
            message: "Teacher updated successfully",
            data: updatedTeacher
        };
    }
    async deleteTeacher(id) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
            include: {
                groupTeachers: true
            }
        });
        if (!teacher)
            throw new common_1.NotFoundException("O'qituvchi topilmadi");
        if (teacher.groupTeachers.length > 0) {
            await this.prisma.groupTeacher.deleteMany({
                where: { teacher_id: id }
            });
        }
        if (teacher.photo) {
            const fs = require('fs');
            const path = `./src/uploads/${teacher.photo.split('/').pop()}`;
            if (fs.existsSync(path))
                fs.unlinkSync(path);
        }
        return this.prisma.teacher.delete({ where: { id } });
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map