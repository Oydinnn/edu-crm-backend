import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create.dto';
import { UpdateCourseDto } from './dto/update.dto '; //
import { Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) {}

    async getAllCourses() {
        const courses = await this.prisma.course.findMany({
            where: { status: Status.active }
        });

        return {
            success: true,
            data: courses
        };
    }

    async createCourse(payload: CreateCourseDto) {
        const existCourse = await this.prisma.course.findUnique({
            where: { name: payload.name }
        });

        if (existCourse) {
            throw new ConflictException("Course already exists");
        }

        await this.prisma.course.create({
             data:{
                name: payload.name,
                description: payload.description,
                price: payload.price,
                duration_month: payload.duration_month,
                duration_hours: payload.duration_hours,
                // status подставится автоматически из @default(active) в схеме
            }
        });

        return {
            success: true,
            message: "Course created"
        };
    }

    // ✏️ Обновление курса
    async updateCourse(id: number, payload: UpdateCourseDto) {
        // 1. Проверяем, существует ли курс
        const existingCourse = await this.prisma.course.findUnique({
            where: { id }
        });

        if (!existingCourse) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        // 2. Если меняют имя, проверяем, не занято ли оно другим курсом
        if (payload.name && payload.name !== existingCourse.name) {
            const duplicate = await this.prisma.course.findFirst({
                where: {
                    name: payload.name,
                    id: { not: id } // Исключаем текущий курс из проверки
                }
            });

            if (duplicate) {
                throw new ConflictException("Course with this name already exists");
            }
        }

        // 3. Обновляем данные
        await this.prisma.course.update({
            where: { id },
             data:{
                name:payload?.name,
                description:payload?.description,
                price:payload?.price,
                duration_hours:payload?.duration_hours,
                duration_month:payload?.duration_month
              } 
        });

        return {
            success: true,
            message: "Course updated"
        };
    }

    // 🗑️ Удаление курса
    async deleteCourse(id: number) {
        // 1. Проверяем, существует ли курс
        const existingCourse = await this.prisma.course.findUnique({
            where: { id }
        });

        if (!existingCourse) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        // 2. Удаляем (Hard Delete)
        // Если нужно мягкое удаление, используй update: { where: { id }, data: { status: Status.inactive } }
        await this.prisma.course.delete({
            where: { id }
        });

        return {
            success: true,
            message: "Course deleted"
        };
    }
}