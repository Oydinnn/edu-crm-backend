"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./core/database/prisma.module");
const users_module_1 = require("./modules/users/users.module");
const students_module_1 = require("./modules/students/students.module");
const teachers_module_1 = require("./modules/teachers/teachers.module");
const courses_module_1 = require("./modules/courses/courses.module");
const groups_module_1 = require("./modules/groups/groups.module");
const rooms_module_1 = require("./modules/rooms/rooms.module");
const auth_module_1 = require("./modules/auth/auth.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const lessons_module_1 = require("./modules/lessons/lessons.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const homework_module_1 = require("./modules/homework/homework.module");
const seeder_module_1 = require("./common/seed/seeder.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), "src", "uploads"),
                serveRoot: "/files"
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true
            }),
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            courses_module_1.CoursesModule,
            groups_module_1.GroupsModule,
            rooms_module_1.RoomsModule,
            lessons_module_1.LessonsModule,
            attendance_module_1.AttendanceModule,
            homework_module_1.HomeworkModule,
            seeder_module_1.SeederModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map