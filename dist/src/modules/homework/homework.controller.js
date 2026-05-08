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
exports.HomeworkController = void 0;
const common_1 = require("@nestjs/common");
const homework_service_1 = require("./homework.service");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const create_dto_1 = require("./dto/create.dto");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const role_guard_1 = require("../../common/guards/role.guard");
const role_1 = require("../../common/decorators/role");
let HomeworkController = class HomeworkController {
    homeworkService;
    constructor(homeworkService) {
        this.homeworkService = homeworkService;
    }
    getOwnHomework(lessonId, req) {
        return this.homeworkService.getOwnHomework(lessonId, req['user']);
    }
    getAllHomework() {
        return this.homeworkService.getAllHomework();
    }
    createHomework(req, payload, file) {
        return this.homeworkService.createHomework(payload, req["user"], file?.filename);
    }
};
exports.HomeworkController = HomeworkController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.STUDENT}`
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.STUDENT),
    (0, common_1.Get)("own/:lessonId"),
    __param(0, (0, common_1.Param)("lessonId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Request]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "getOwnHomework", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}`
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "getAllHomework", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}`
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN, client_1.Role.TEACHER),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                lesson_id: { type: "number" },
                group_id: { type: "number" },
                file: { type: 'string', format: 'binary' },
                title: { type: "string" },
            }
        }
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./src/uploads/files",
            filename: (req, file, cb) => {
                const filename = Date.now() + "." + file.mimetype.split("/")[1];
                cb(null, filename);
            }
        })
    })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        create_dto_1.CreateHomeworkDto, Object]),
    __metadata("design:returntype", void 0)
], HomeworkController.prototype, "createHomework", null);
exports.HomeworkController = HomeworkController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('homework'),
    __metadata("design:paramtypes", [homework_service_1.HomeworkService])
], HomeworkController);
//# sourceMappingURL=homework.controller.js.map