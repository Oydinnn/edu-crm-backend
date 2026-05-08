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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("./courses.service");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const role_1 = require("../../common/decorators/role");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const role_guard_1 = require("../../common/guards/role.guard");
const create_dto_1 = require("./dto/create.dto");
const update_dto_1 = require("./dto/update.dto ");
let CoursesController = class CoursesController {
    courseService;
    constructor(courseService) {
        this.courseService = courseService;
    }
    getAllCourses() {
        return this.courseService.getAllCourses();
    }
    createCourse(payload) {
        return this.courseService.createCourse(payload);
    }
    updateCourse(id, payload) {
        return this.courseService.updateCourse(id, payload);
    }
    deleteCourse(id) {
        return this.courseService.deleteCourse(id);
    }
};
exports.CoursesController = CoursesController;
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
], CoursesController.prototype, "getAllCourses", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}`,
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.CreateCourseDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "createCourse", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Update course | ${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}`,
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "updateCourse", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Delete course | ${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}`,
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "deleteCourse", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("courses"),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map