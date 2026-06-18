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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
let FilesService = class FilesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFiles(groupId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId }
        });
        if (!group) {
            throw new Error("Guruh topilmadi");
        }
        const videos = await this.prisma.lessonVideo.findMany({
            where: { group_id: groupId },
            select: {
                id: true,
                video_url: true,
                size_mb: true,
                originalname: true,
                created_at: true,
                lesson: {
                    select: {
                        id: true,
                        topic: true,
                        created_at: true,
                    }
                }
            }
        });
        return {
            success: true,
            data: videos
        };
    }
    async uploadFile(groupId, lessonId, file, originalname) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });
        if (!group) {
            throw new Error("Guruh topilmadi");
        }
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId }
        });
        if (!lesson) {
            throw new Error("Dars topilmadi");
        }
        await this.prisma.lessonVideo.create({
            data: {
                lesson_id: lesson.id,
                group_id: group.id,
                video_url: file.filename,
                originalname: originalname || file.originalname,
                size_mb: file.size / 1024 / 1024,
            }
        });
        return {
            success: true,
            message: "File uploaded successfully"
        };
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FilesService);
//# sourceMappingURL=files.service.js.map