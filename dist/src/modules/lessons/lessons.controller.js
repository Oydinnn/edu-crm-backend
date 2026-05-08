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
exports.LessonsController = void 0;
const common_1 = require("@nestjs/common");
const lessons_service_1 = require("./lessons.service");
const create_lesson_dto_1 = require("./dto/create.lesson.dto");
const role_1 = require("../../common/decorators/role");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const role_guard_1 = require("../../common/guards/role.guard");
const swagger_1 = require("@nestjs/swagger");
let LessonsController = class LessonsController {
    lessonService;
    constructor(lessonService) {
        this.lessonService = lessonService;
    }
    getMyGroupLessons(groupId, req) {
        return this.lessonService.getMyGroupLessons(groupId, req['user']);
    }
    getAllLessons() {
        return this.lessonService.getAllLessons();
    }
    createLesson(payload, req) {
        return this.lessonService.createLesson(payload, req['user']);
    }
};
exports.LessonsController = LessonsController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.STUDENT}`
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.STUDENT),
    (0, common_1.Get)("my/group/:groupId"),
    __param(0, (0, common_1.Param)("groupId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Request]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "getMyGroupLessons", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.ADMIN}`
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPERADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "getAllLessons", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.ADMIN}, ${client_1.Role.TEACHER}`
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lesson_dto_1.CreateLessonDto,
        Request]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "createLesson", null);
exports.LessonsController = LessonsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('lessons'),
    __metadata("design:paramtypes", [lessons_service_1.LessonsService])
], LessonsController);
//# sourceMappingURL=lessons.controller.js.map