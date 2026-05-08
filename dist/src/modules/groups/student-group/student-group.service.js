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
exports.StudentGroupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../core/database/prisma.service");
const client_1 = require("@prisma/client");
let StudentGroupService = class StudentGroupService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllStudentGroup() {
        const studentGroups = await this.prisma.studentGroup.findMany({
            where: {
                status: client_1.Status.active
            }
        });
        return {
            sucess: true,
            data: studentGroups
        };
    }
    async createStudentGroup(payload) {
        const existStudent = await this.prisma.student.findFirst({
            where: {
                id: payload.student_id,
                status: client_1.Status.active
            }
        });
        if (!existStudent) {
            throw new common_1.NotFoundException("Student not found with this id");
        }
        const existGroup = await this.prisma.group.findFirst({
            where: {
                id: payload.group_id,
                status: client_1.Status.active
            }
        });
        if (!existGroup) {
            throw new common_1.NotFoundException("Group not found with this id");
        }
        const existGroupStudent = await this.prisma.studentGroup.findFirst({
            where: {
                student_id: payload.student_id,
                group_id: payload.group_id,
                status: client_1.Status.active
            }
        });
        if (existGroupStudent) {
            throw new common_1.ConflictException("Stundet is already in group");
        }
        const existGroupStundetCount = await this.prisma.studentGroup.count({
            where: {
                group_id: payload.group_id
            }
        });
        if (existGroupStundetCount >= existGroup.max_student) {
            throw new common_1.BadRequestException("Group is full");
        }
        await this.prisma.studentGroup.create({
            data: payload
        });
        return {
            success: true,
            message: "Student added group"
        };
    }
};
exports.StudentGroupService = StudentGroupService;
exports.StudentGroupService = StudentGroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentGroupService);
//# sourceMappingURL=student-group.service.js.map