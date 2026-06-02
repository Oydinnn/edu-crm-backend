import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateHomeworkDto } from "./dto/create.dto";
import { HomeworkStatus, Role } from "@prisma/client";
import { CreateHomeworkAnswerDto } from "../students/dto/createHomeworkAnswer.dto";
import { stat } from "node:fs";
import { HomeworkResultDto } from "./dto/homework.result.dto";

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}

  async getOwnHomework(lessonId: number, currentUser: { id: number }) {
    const myLessons = await this.prisma.homework.findMany({
      where: {
        lesson_id: lessonId,
      },
      select: {
        id: true,
        title: true,
        file: true,
        created_at: true,
        update_at: true,
        teachers: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            photo: true,
          },
        },
        users: {
          select: {
            id: true,
            last_name: true,
            first_name: true,
            phone: true,
            photo: true,
          },
        },
      },
    });

    const homeworkFormated = myLessons.map((el) => {
      if (!el.teachers) {
        return {
          id: el.id,
          title: el.title,
          file: el.file,
          created_at: el.created_at,
          update_at: el.update_at,
          user: el.users,
        };
      } else {
        return {
          id: el.id,
          title: el.title,
          file: el.file,
          created_at: el.created_at,
          update_at: el.update_at,
          teacher: el.teachers,
        };
      }
    });

    return {
      success: true,
      data: homeworkFormated,
    };
  }

  async getAllHomework() {
    const homeworks = await this.prisma.homework.findMany();

    return {
      success: true,
      data: homeworks,
    };
  }

  async createHomework(
    payload: CreateHomeworkDto,
    currentUser: { id: number; role: Role },
    filename?: string,
  ) {
    const existLesson = await this.prisma.lesson.findFirst({
      where: {
        id: payload.lesson_id,
      },
      select: {
        groups: {
          select: {
            groupTeachers: {
              select: {
                teacher_id: true,
              },
            },
          },
        },
      },
    });

    if (!existLesson) {
      throw new NotFoundException("Lesson not fount with this id");
    }

    // if (currentUser.role == Role.TEACHER && existLesson.groups.teacher_id != currentUser.id) {
    //     throw new ForbiddenException("Is not your lesson")
    // }

    // ✅ ПРАВИЛЬНО - проверяем, входит ли текущий учитель в массив groupTeachers
    const isTeacherOfGroup = existLesson?.groups.groupTeachers.some(
      (gt) => gt.teacher_id === currentUser.id,
    );

    if (currentUser.role == Role.TEACHER && !isTeacherOfGroup) {
      throw new ForbiddenException("This lesson is not assigned to you");
    }

    await this.prisma.homework.create({
      data: {
        ...payload,
        file: filename,
        teacher_id: currentUser.role == "TEACHER" ? currentUser.id : null,
        user_id: currentUser.role != "TEACHER" ? currentUser.id : null,
      },
    });

    return {
      success: true,
      message: "Homework recorded",
    };
  }

  async getGroupHomework(
    groupId: number,
    currentUser: { id: number; role: Role },
  ) {
    const group = await this.prisma.group.findFirst({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new NotFoundException("Group not found with this id");
    }

    const homeworks = await this.prisma.homework.findMany({
      where: {
        group_id: groupId,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        title: true,
        file: true,
        created_at: true,
        lesson_id: true,
        lesson: {
          select: {
            id: true,
            topic: true,
            created_at: true,
          },
        },
        homeworkAnswerStudents: {
          select: {
            id: true,
            homeworkStatus: true,
          },
        },
      },
    });

    const existStudentInGroup = await this.prisma.studentGroup.count({
      where: {
        group_id: groupId,
      },
    });

    const groupFormated = homeworks.map((el) => {
      const pendingCount = el.homeworkAnswerStudents.filter(
        (ans) => ans.homeworkStatus === HomeworkStatus.PENDING,
      ).length;

      const checkedCount = el.homeworkAnswerStudents.filter(
        (ans) => ans.homeworkStatus === HomeworkStatus.CHECKED,
      ).length;

      return {
        id: el.lesson?.id ?? el.lesson_id,
        topic: el.lesson?.topic ?? el.title,
        created_at: el.lesson?.created_at ?? el.created_at,
        homework: [
          {
            id: el.id,
            title: el.title,
            file: el.file,
            created_at: el.created_at,
            student_count: existStudentInGroup,
            homeworkPending: pendingCount,
            homeworkAccepted: checkedCount,
          },
        ],
      };
    });

    return {
      success: true,
      data: {
        groupFormated,
        homeworkPending: 0, // Fallback/Compatibility with general summary if needed
        homeworkAccepted: 0,
        existStudentInGroup,
      },
    };
  }

  async getHomeworkResults(
    groupId: number,
    homeworkId: number,
    status?: HomeworkStatus,
  ) {
    if (status == HomeworkStatus.PENDING || status == HomeworkStatus.CHECKED) {
      const studentResults = await this.prisma.homeworkAnswerStudent.findMany({
        where: {
          homeworkStatus: status,
          homework_id: homeworkId,
        },
        orderBy: {
          created_at: "desc",
        },
        select: {
          created_at: true,
          students: {
            select: {
              id: true,
              full_name: true,
            },
          },
        },
      });

      return {
        success: true,
        data: studentResults.map((el) => ({
          ...el.students,
          sent_at: el.created_at,
        })),
      };
    } else if (
      status == HomeworkStatus.ACCEPTED ||
      status == HomeworkStatus.REJECTED
    ) {
      const studentResults = await this.prisma.homeworkResult.findMany({
        where: {
          homework_id: homeworkId,
          group_id: groupId,
          homeworkStatus: status,
        },
        orderBy: {
          created_at: "desc",
        },
        select: {
          homeworkAnswerStudent: {
            select: {
              created_at: true,
              students: {
                select: {
                  id: true,
                  full_name: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        data: studentResults.map((el) => ({
          ...el.homeworkAnswerStudent.students,
          sent_at: el.homeworkAnswerStudent.created_at,
        })),
      };
    }

    const studentIds = await this.prisma.studentGroup.findMany({
      where: {
        group_id: groupId,
      },
      select: {
        student_id: true, 
          },
    });

    const allStudentIds = studentIds.map((el) => el.student_id);
    const topshirganTalabalar = await this.prisma.homeworkAnswerStudent.findMany({
      where: {
        homework_id: homeworkId,
      }     
    });

    let topshirganTalabalarIds = topshirganTalabalar.map((el) => el.student_id);
    const topshirmaganTalabalar = await this.prisma.studentGroup.findMany({
      where: {
        group_id: groupId,
        student_id: {
          notIn: topshirganTalabalarIds,
        },
      },
      include: {
    students: {  // student modelini qo'shish
      select: {
        id: true,
        full_name: true,
      },
    },
  },
    });

    return {
      success: true,
      data: topshirmaganTalabalar.map((el) => el.students),
    };
  }

  async getGroupHomeworkStudentResult(
    groupId: number,
    homeworkId: number,
    studentId: number,
  ) {
    const studentResult = await this.prisma.homeworkAnswerStudent.findFirst({
      where: {
        homework_id: homeworkId,
        student_id: studentId,
      },
      select: {
        id: true,
        title: true,  
        file: true,
        created_at: true,
        students: {
          select: {
            id: true,
            full_name: true,
          },    
        },
      },
    });
    return {
      success: true,
      data: studentResult,
    };
  }


  async checkHomeworkResult(
    groupId: number,
    homeworkId: number,
    payload: HomeworkResultDto,
    currentUser: { id: number; role: Role },
  ) {
    await this.prisma.homeworkResult.create({
      data: {
        homework_answer_id: payload.homework_answer_id,
        group_id: groupId,
        homework_id: homeworkId,
        grade: payload.grade,
        title: payload.title,
        teacher_id: currentUser.role == Role.TEACHER ? currentUser.id : null,
        user_id: currentUser.role != Role.ADMIN ? currentUser.id : null,
        homeworkStatus: payload.grade >= 60 ? HomeworkStatus.ACCEPTED : HomeworkStatus.REJECTED,
      },
    })
    await this.prisma.homeworkAnswerStudent.update({
      where: {
        id: payload.homework_answer_id,
      },
      data: {
        homeworkStatus: HomeworkStatus.CHECKED,
      },
    })
    return {
      success: true,
      message: "Homework checked",
    };
  }}
