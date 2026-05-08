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
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
let TeachersService = class TeachersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
            filename && fs.unlinkSync(`src/uploads/${filename}`);
            throw new common_1.ConflictException("Teacher with this phone or email already exists");
        }
        let existingGroups = Array();
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
        const hashPass = await bcrypt.hash(payload.password, 10);
        await this.prisma.teacher.create({
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
                            group: {
                                connect: { id: groupId },
                            },
                        })),
                    }
                    : undefined,
            },
        });
        return {
            success: true,
            message: "Teacher created",
        };
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map