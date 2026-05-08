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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const students_service_1 = require("./students.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const role_guard_1 = require("../../common/guards/role.guard");
const role_1 = require("../../common/decorators/role");
const swagger_1 = require("@nestjs/swagger");
const create_dto_1 = require("./dto/create.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const pagination_dto_1 = require("./dto/pagination.dto");
let StudentsController = class StudentsController {
    studentService;
    constructor(studentService) {
        this.studentService = studentService;
    }
    getMyGroups(req) {
        return this.studentService.getMyGroups(req['user']);
    }
    getAllStudents(pagination) {
        return this.studentService.getAllStudents(pagination);
    }
    createStudent(payload, file) {
        return this.studentService.createStudent(payload, file?.filename);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.STUDENT}`,
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.STUDENT),
    (0, common_1.Get)("my/groups"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getMyGroups", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}`,
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getAllStudents", null);
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
                first_name: { type: 'string', example: "Alish" },
                last_name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                phone: { type: 'string' },
                photo: { type: 'string', format: 'binary' },
                address: { type: "string" },
                birth_date: { type: 'string', format: 'date', example: '2000-01-01' },
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
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["png", "jpg", "jpeg"];
            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new common_1.UnsupportedMediaTypeException(), false);
            }
            cb(null, true);
        }
    })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.CreateStudentDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "createStudent", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map