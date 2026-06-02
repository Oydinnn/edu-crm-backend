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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const files_service_1 = require("./files.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const role_guard_1 = require("../../common/guards/role.guard");
const role_1 = require("../../common/decorators/role");
const client_1 = require("@prisma/client");
let FilesController = class FilesController {
    fileService;
    constructor(fileService) {
        this.fileService = fileService;
    }
    async getFiles(groupId) {
        return this.fileService.getFiles(groupId);
    }
    async uploadFile(lessonId, groupId, originalname, file) {
        return this.fileService.uploadFile(groupId, lessonId, file, originalname);
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}, ${client_1.Role.TEACHER}`,
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN, client_1.Role.TEACHER),
    (0, common_1.Get)(":groupId"),
    __param(0, (0, common_1.Param)("groupId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFiles", null);
__decorate([
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                video: { type: 'string', format: 'binary' },
                originalname: { type: 'string' },
            }
        }
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN, client_1.Role.TEACHER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("video", {
        storage: (0, multer_1.diskStorage)({
            destination: "./src/uploads/files",
            filename: (req, file, cb) => {
                const filename = Date.now() + "." + file.mimetype.split("/")[1];
                cb(null, filename);
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["mp4", "webm", "avi", "mkv", "mov", "mpeg", "mpeg4", "3gp", "3g2", "flv", "wmv", "rm", "rmvb", "ogv", "asf", "m2v", "m4v", "mpg", "mpeg4", "vob", "mkv"];
            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new common_1.UnsupportedMediaTypeException("Faqat video fayllar ruxsat etilgan"), false);
            }
            cb(null, true);
        }
    })),
    (0, common_1.Post)('upload'),
    __param(0, (0, common_1.Query)("lessonId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("groupId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)("originalname")),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadFile", null);
exports.FilesController = FilesController = __decorate([
    (0, common_1.Controller)('files'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map