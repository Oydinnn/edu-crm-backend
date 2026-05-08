import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateTeacherDto } from "./dto/create.dto";
import * as bcrypt from "bcrypt";
import { Status } from "@prisma/client";
import * as fs from "fs";


@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async getAllTeachers() {
    const teachers = await this.prisma.teacher.findMany({
      where: {
        status: Status.active,
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
      // ✅ To'g'ri URL: /files/rasm.jsg
      photoUrl = `/files/${el.photo}`;
      
      // Yoki to'liq URL:
      // photoUrl = `${process.env.API_URL || 'http://localhost:3000'}/files/${el.photo}`;
    }

    return {
      id: el.id,
      full_name: el.full_name,
      phone: el.phone,
      photo: photoUrl,  // "/files/rasm.jsg"
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

  async createTeacher(payload: CreateTeacherDto, filename?: string) {
    const existTeacher = await this.prisma.teacher.findFirst({
      where: {
        OR: [{ phone: payload.phone }, { email: payload.email }],
      },
    });

    if (existTeacher) {
      filename && fs.unlinkSync(`src/uploads/${filename}`);
      throw new ConflictException(
        "Teacher with this phone or email already exists",
      );
    }

    // 2. Проверка существования групп (если переданы)
    let existingGroups = Array();
    if (payload.groups?.length) {
      existingGroups = await this.prisma.group.findMany({
        where: { id: { in: payload.groups } },
        select: { id: true },
      });

      // ✅ Проверка: все ли группы существуют
      if (existingGroups.length !== payload.groups.length) {
        const foundIds = existingGroups.map((g) => g.id);
        const missingIds = payload.groups.filter(
          (id) => !foundIds.includes(id),
        );
        throw new NotFoundException(
          `Guruhlar topilmadi: ${missingIds.join(", ")}`,
        );
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
}
