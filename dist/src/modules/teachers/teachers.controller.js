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
exports.TeachersController = void 0;
const common_1 = require("@nestjs/common");
const teachers_service_1 = require("./teachers.service");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const role_guard_1 = require("../../common/guards/role.guard");
const role_1 = require("../../common/decorators/role");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const create_dto_1 = require("./dto/create.dto");
let TeachersController = class TeachersController {
    teacherService;
    constructor(teacherService) {
        this.teacherService = teacherService;
    }
    getAllTeachers() {
        return this.teacherService.getAllTeachers();
    }
    createTeacher(payload, file) {
        return this.teacherService.createTeacher(payload, file?.filename);
    }
};
exports.TeachersController = TeachersController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}`,
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "getAllTeachers", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}`,
        description: "Bu endpointga admin va superadmin huquqi bor"
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                full_name: { type: 'string', example: "Ali" },
                email: { type: 'string' },
                password: { type: 'string' },
                phone: { type: 'string' },
                photo: { type: 'string', format: 'binary' },
                address: { type: "string" },
                groups: { type: 'array', items: { type: 'number' }, example: [1, 2] },
            }
        }
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("photo", {
        storage: (0, multer_1.diskStorage)({
            destination: "./src/uploads",
            filename: (req, file, cb) => {
                const filename = Date.now() + "." + file.mimetype.split("/")[1];
                cb(null, filename);
            }
        })
    })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.CreateTeacherDto, Object]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "createTeacher", null);
exports.TeachersController = TeachersController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('teachers'),
    __metadata("design:paramtypes", [teachers_service_1.TeachersService])
], TeachersController);
//# sourceMappingURL=teachers.controller.js.map