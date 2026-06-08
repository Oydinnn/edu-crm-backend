import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateGroupDto } from "./dto/create.dto";
import { GroupStatus, HomeworkStatus, Status } from "@prisma/client";
import { filterDto } from "./dto/search";
import { UpdateGroupDto } from "./dto/update.dto";
import { CreateLessonDto } from "../lessons/dto/create.lesson.dto";
import { create } from "node:domain";
import { start } from "node:repl";
import { async } from "rxjs";

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}


  async getLessonsByGroupId(groupId: number, userId: number) {
    const existsStudent = await this.prisma.studentGroup.findFirst({
      where:{
        group_id:groupId,
        student_id:userId,
        status:Status.active,
      },
    })
    if (!existsStudent) {
      throw new NotFoundException("Group not found with this id");
    }
    const lessons = await this.prisma.lesson.findMany({
      where:{
        group_id:groupId,
        status:Status.active,
      },
      select:{
        id:true,
        topic:true,
        created_at:true,
        _count:{
          select:{
            lessonVideos:true,
          }
        },
        homework:{
          select:{
            id:true,
          }
        }
      }
    })
    let  lessonsFormatted = lessons.map(lesson => {
      return {
        id: lesson.id,
        topic: lesson.topic,  
        created_at: lesson.created_at,
        homework_id: lesson.homework[0]?.id ? lesson.homework[0].id : null, // Har bir dars uchun bitta homework bor deb taxmin qilamiz;
        videoCount: lesson._count.lessonVideos || 0, // Har bir dars uchun video soni
  }})
  return lessonsFormatted;
  }



  async getLessons(groupId: number, userId: number) {
    const existGroup = await this.prisma.studentGroup.findFirst({
      where:{
        group_id:groupId,
        student_id:userId,
      },
    })
    if (!existGroup) {
      throw new NotFoundException("Group not found with this id");
    }
      let lessons: any = await this.prisma.lesson.findMany({
      where:{
        group_id:groupId,
        status:Status.active,
      },
      select:{
        id:true,
        topic:true,
        created_at:true,

        _count:{
          select:{
            lessonVideos:true,
          }
        },
        
        homework:{
          select:{
            lesson_id:true,
            homeworkAnswerStudents:{
              where:{
                student_id:userId,
              },
              select:{
                homeworkStatus: true,
                homeworkResults:{
                  select:{
                    homeworkStatus:true,
                  }
                }
                
              }
            }
            
          }
        }
      }
    })
    
    
    lessons = lessons.map(lesson => {
      if (lesson.homework.length === 0) {
        return {
          ...lesson,
          status: 'berilmagan',
        };
      }
      const answer = lesson.homework[0]?.homeworkAnswerStudents?.[0];
      if (!answer) {
        return {
          ...lesson,
          status: 'bajarilmagan',
        };
      }
      if (answer.homeworkStatus === HomeworkStatus.PENDING) {
        return {
          ...lesson,
          status: 'kutilmoqda',
        };
      }
      const result = answer.homeworkResults?.[0];
      if (result?.homeworkStatus === HomeworkStatus.ACCEPTED) {
        return {
          ...lesson,
          status: 'bajarilgan',
        };
      }
      if (result?.homeworkStatus === HomeworkStatus.REJECTED) {
        return {
          ...lesson,
          status: 'qaytarilgan',
        };
      }
      return {
        ...lesson,
        status: 'bajarilmagan',
      };
    })
    const lessonFormatted = lessons.map(lesson => ({
        topic: lesson?.topic,
        created_at: lesson?.created_at,
        status: lesson?.status,
        videoCount:lesson?._count?.lessonVideos
    })
  )
  return  lessonFormatted;
  

  }

  async getGroupOne(groupId: number) {
    const existGroup = await this.prisma.group.findFirst({
      where: {
        id: groupId,
        status: Status.active,
      },
    });

    if (!existGroup) {
      throw new NotFoundException("Group not found with this id");
    }

    const groupStudents = await this.prisma.studentGroup.findMany({
      where: {
        group_id: groupId,
        status: Status.active,
      },
      select: {
        students: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            email: true,
            photo: true,
            birth_date: true,
            created_at: true,
          },
        },
      },
    });

    const dataFormatter = groupStudents.map((el) => el.students);

    return {
      success: true,
      data: dataFormatter,
    };
  }

  async getAllGroups(search: filterDto) {
    const { groupName, max_student, status } = search;
    let searchWhere = {};

    if (status) {
      searchWhere["status"] = status;
    } else {
      searchWhere["status"] = "active"; // default
    }

    if (groupName) searchWhere["name"] = groupName;
    if (max_student) searchWhere["max_student"] = +max_student;

    const groups = await this.prisma.group.findMany({
      where: searchWhere,
      select: {
        id: true,
        name: true,
        max_student: true,
        start_date: true,
        start_time: true,
        week_day: true,
        status: true,
        description: true,
        courses: {
          select: {
            id: true,
            name: true,
            duration_month: true, // Kurs necha oy davom etishi
            duration_hours: true, // Jami dars soatlari
          },
        },
        rooms: {
          select: {
            id: true,
            name: true,
          },
        },
        groupTeachers: {
          select: {
            teacher: {
              select: {
                id: true,
                full_name: true,
              },
            },
          },
        },
        studentGroups: {
          select: {
            students: {
              select: {
                _count: true,
                id: true,
                full_name: true,
              },
            },
          },
        },
      },
    });

    const dataFormatter = groups.map((el) => ({
      id: el.id,
      name: el.name,
      max_student: el.max_student,
      start_date: el.start_date,
      start_time: el.start_time,
      weekDay: el.week_day,
      status: el.status,
      description: el.description,
      course: el.courses?.name || "Noma'lum",
      course_duration_month: el.courses?.duration_month || 0,
      course_duration_hours: el.courses?.duration_hours || 0,
      room: el.rooms?.name || "Noma'lum",
      teachers: el.groupTeachers?.map((gt) => gt.teacher) || [],
      students: el.studentGroups?.map((sg) => sg.students) || [],
      student_count: el.studentGroups?.length || 0,
    }));

    return {
      success: true,
      data: dataFormatter,
    };
  }

  async getGroupById(groupId: number) {
    // Barcha kerakli ma'lumotlarni bitta so'rovda olamiz
    const group = await this.prisma.group.findFirst({
      where: { id: groupId },
      select: {
        id: true,
        name: true, // Guruh nomi (sarlavhada ko'rsatiladi)
        status: true, // Guruh holati
        studentGroups: {
          where: { status: Status.active },
          select: {
            students: {
              select: {
                id: true,
                full_name: true,
              },
            },
          },
        },
        start_date: true, // Boshlanish sanasi
        start_time: true, // Dars boshlanish vaqti
        week_day: true, // Hafta dars kunlari (["MONDAY","WEDNESDAY"...])
        max_student: true, // Maksimal talabalar
        description: true,
        // O'qituvchilar — photo bilan
        groupTeachers: {
          // where: { status: Status.active },
          select: {
            teacher: {
              select: {
                id: true,
                full_name: true,
                phone: true,
                photo: true, // O'qituvchi rasmi URL
              },
            },
          },
        },
        // Kurs — nomi va davomiyligi
        courses: {
          select: { id: true, name: true, duration_month: true },
        },
        // Xona — nomi va sig'imi
        rooms: {
          select: { id: true, name: true, capacity: true },
        },
      },
    });

    if (!group) {
      throw new NotFoundException("Bunday guruh topilmadi.");
    }

    // Faol talabalar sonini hisoblaymiz
    const studentCount = await this.prisma.studentGroup.count({
      where: { group_id: groupId, status: Status.active },
    });

    // O'rtacha yosh — birth_date dan hisoblash
    const ageResult = await this.prisma.$queryRaw<{ avg_age: number }[]>`
      SELECT AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.birth_date))) as avg_age
      FROM "Student" s
      INNER JOIN "StudentGroup" sg ON s.id = sg.student_id
      WHERE sg.group_id = ${groupId} AND sg.status = 'active'
    `;

    return {
      success: true,
      data: {
        id: group.id,
        name: group.name,
        status: group.status,
        start_date: group.start_date,
        start_time: group.start_time,
        week_day: group.week_day, // Frontend dars jadvali uchun
        max_student: group.max_student,
        description: group.description,
        teachers: group.groupTeachers?.map((gt) => gt.teacher) || [],
        students: group.studentGroups?.map((sg) => sg.students) || [],
        course: group.courses, // {id, name, duration_month}
        course_duration_month: group.courses?.duration_month || 0,
        room: group.rooms?.name || null, // Xona nomi (string)
        room_capacity: group.rooms?.capacity || null,
        student_count: studentCount,
        students_avg_age: Number(ageResult[0]?.avg_age || 0).toFixed(1),
      },
    };
  }

  async createGroup(payload: CreateGroupDto) {
    // Vaqtni minutlarga o'tkazish yordamchi funksiyasi
    const timeToMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    // 1. XONANI TEKSHIRISH
    const existRoom = await this.prisma.room.findFirst({
      where: {
        id: payload.room_id,
        status: Status.active,
      },
    });
    if (!existRoom) {
      throw new NotFoundException("Bunday xona topilmadi yoki nofaol.");
    }

    // 2. KURSни TEKSHIRISH
    const existCourse = await this.prisma.course.findFirst({
      where: {
        id: payload.course_id,
        status: Status.active,
      },
    });
    if (!existCourse) {
      throw new NotFoundException("Bunday kurs topilmadi yoki nofaol.");
    }

    // 3. GURUH NOMI TAKRORLANMASLIGINI TEKSHIRISH
    const existGroup = await this.prisma.group.findUnique({
      where: { name: payload.name },
    });
    if (existGroup) {
      throw new ConflictException("Bunday nomli guruh allaqachon mavjud.");
    }

    // 4. VAQT TO'QNASHUVINI TEKSHIRISH (Conflict logic)
    const startNew = timeToMinutes(payload.start_time);
    // Diqqat: duration_hours bitta dars soati bo'lishi kerak (masalan: 1.5 yoki 2)
    const endNew = startNew + existCourse.duration_hours * 60;

    const roomGroups = await this.prisma.group.findMany({
      where: {
        room_id: payload.room_id,
        status: Status.active,
        week_day: {
          hasSome: payload.week_day as string[], // Tanlangan kunlarda dars borligini tekshirish
        },
      },
      include: {
        courses: true, // Davomiyligini bilish uchun kursni ham olamiz
      },
    });

    const conflictGroup = roomGroups.find((el) => {
      const start = timeToMinutes(el.start_time);
      const end = start + el.courses.duration_hours * 60;

      // To'qnashuv algoritmi
      return start < endNew && end > startNew;
    });

    if (conflictGroup) {
      throw new ConflictException(
        `Xona band! "${conflictGroup.name}" guruhi bilan vaqt to'qnashmoqda (${conflictGroup.start_time} da dars boshlanadi).`,
      );
    }

    // 5. O'QITUVCHILARNI TEKSHIRISH
    if (payload.teachers?.length) {
      const foundTeachers = await this.prisma.teacher.findMany({
        where: { id: { in: payload.teachers } },
      });
      if (foundTeachers.length !== payload.teachers.length) {
        throw new NotFoundException("Ba'zi o'qituvchilar topilmadi.");
      }
    }

    // 6. STUDENTLARNI TEKSHIRISH
    if (payload.students?.length) {
      const foundStudents = await this.prisma.student.findMany({
        where: { id: { in: payload.students } },
      });
      if (foundStudents.length !== payload.students.length) {
        throw new NotFoundException("Ba'zi talabalar topilmadi.");
      }
    }

    // 7. GURUHNI YARATISH (Transaction-like creation)
    const newGroup = await this.prisma.group.create({
      data: {
        name: payload.name,
        description: payload.description,
        course_id: payload.course_id,
        room_id: payload.room_id,
        start_time: payload.start_time,
        max_student: payload.max_student,
        week_day: payload.week_day as string[],
        start_date: new Date(payload.start_date),
        // Munosabatlarni ulash
        groupTeachers: payload.teachers?.length
          ? {
              create: payload.teachers.map((id) => ({
                teacher_id: id,
              })),
            }
          : undefined,
        studentGroups: payload.students?.length
          ? {
              create: payload.students.map((id) => ({
                student_id: id,
              })),
            }
          : undefined,
      },
    });

    return {
      success: true,
      message: "Guruh muvaffaqiyatli yaratildi",
      data: newGroup,
    };
  }

  async updateGroup(id: number, payload: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) throw new NotFoundException(`Guruh topilmadi (id: ${id})`);

    const { teachers, students, ...rest } = payload;

    if (rest.start_date) {
      rest.start_date = new Date(rest.start_date).toISOString() as any;
    }

    // 1. Asosiy maydonlarni yangilaymiz
    await this.prisma.group.update({
      where: { id },
      data: { ...rest },
    });

    // 2. Teachers kelgan bo'lsa — junction tableni yangilaymiz
    if (Array.isArray(teachers)) {
      await this.prisma.groupTeacher.deleteMany({ where: { group_id: id } });
      if (teachers.length > 0) {
        await this.prisma.groupTeacher.createMany({
          data: teachers.map((teacher_id) => ({ group_id: id, teacher_id })),
        });
      }
    }

    // 3. Students kelgan bo'lsa — junction tableni yangilaymiz
    if (Array.isArray(students)) {
      await this.prisma.studentGroup.deleteMany({ where: { group_id: id } });
      if (students.length > 0) {
        await this.prisma.studentGroup.createMany({
          data: students.map((student_id) => ({ group_id: id, student_id })),
        });
      }
    }

    return { success: true, message: "Guruh yangilandi" };
  }

  // groups.service.ts
  async toggleStatus(id: number, status: GroupStatus) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) throw new NotFoundException(`Guruh topilmadi`);

    return this.prisma.group.update({
      where: { id },
      data: { status }, // faqat status yangilanadi
    });
  }

  async deleteGroup(id: number) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) throw new NotFoundException(`Guruh topilmadi (id: ${id})`);

    // 1. Junction tablelarni tozalaymiz
    await this.prisma.groupTeacher.deleteMany({ where: { group_id: id } });
    await this.prisma.studentGroup.deleteMany({ where: { group_id: id } });

    await this.prisma.group.delete({ where: { id } });
    return { message: "Guruh muvaffaqiyatli o'chirildi" };
  }

  async getSchedules(groupId: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { courses: true },
    });

    if (!group) {
      throw new NotFoundException("Group not found");
    }

    const weekDayMap = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "November",
      "December",
    ];

    const { start_date, week_day, courses } = group;
    const duration = courses.duration_month;
    const targetWeekDays = week_day.map((wd) => weekDayMap[wd]);

    const completedLessons = await this.prisma.lesson.findMany({
      where: {
        group_id: groupId,
      },
      select: { created_at: true },
    });

    const completedDates = new Set(
      completedLessons.map((l) => l.created_at.toISOString().split("T")[0]),
    );

    const schedules = {};
    const now = new Date();
    let currentDate = new Date(start_date);

    for (let i = 1; i <= duration; i++) {
      const monthDates = [] as {
        day: number;
        month: string;
        isCompleted: boolean;
      }[];
      const monthStart = new Date(currentDate);
      const endOfPeriod = new Date(currentDate);
      endOfPeriod.setMonth(endOfPeriod.getMonth() + 1);

      const isActive = now >= monthStart && now < endOfPeriod;

      while (currentDate < endOfPeriod) {
        if (targetWeekDays.includes(currentDate.getDay())) {
          const dateStr = currentDate.toISOString().split("T")[0];
          monthDates.push({
            day: currentDate.getDate(),
            month: monthNames[currentDate.getMonth()],
            isCompleted: completedDates.has(dateStr),
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      schedules[i] = {
        isActive,
        day: monthDates,
      };
    }
    return [schedules];
  }

  async createLesson(
    groupId: number,
    payload: CreateLessonDto,
    dateStr: string,
  ) {
    const date = new Date(dateStr);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const existGroup = await this.prisma.group.findFirst({
      where: {
        id: groupId,
        status: Status.active,
      },
    });
    if (!existGroup) {
      throw new NotFoundException("Bunday guruh topilmadi yoki nofaol.");
    }

    // Check if lesson exists for this date
    const existLesson = await this.prisma.lesson.findFirst({
      where: {
        group_id: groupId,
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // If lesson exists -> update topic/description and replace attendances (upsert behavior)
    if (existLesson) {
      const updatedLesson = await this.prisma.$transaction(async (tx) => {
        // update lesson fields
        const l = await tx.lesson.update({
          where: { id: existLesson.id },
          data: {
            topic: payload.topic,
            description: payload.description,
          },
        });

        // remove old attendances for this lesson (restrict by lesson_id)
        await tx.attendance.deleteMany({ where: { lesson_id: existLesson.id } });

        // create new attendances if provided
        if (payload.attendances?.length) {
          await tx.attendance.createMany({
            data: payload.attendances.map((a) => ({
              lesson_id: existLesson.id,
              student_id: a.student_id,
              isPresent: a.isPresent,
              created_at: startOfDay,
            })),
          });
        }

        return l;
      });

      // fetch attendance list with student info to return
      const attendances = await this.prisma.attendance.findMany({
        where: { lesson_id: existLesson.id },
        include: {
          students: { select: { id: true, full_name: true, photo: true } },
        },
      });

      const groupStudents = await this.prisma.studentGroup.findMany({
        where: { group_id: groupId, status: Status.active },
        select: { students: { select: { id: true, full_name: true, photo: true } } },
      });
      const students = groupStudents.map((el) => el.students);

      // build a map from student_id -> isPresent (use actual flag from attendance rows)
      const attMap = new Map(attendances.map((a) => [a.student_id, a.isPresent]));

      const attendanceList = students.map((student) => ({
        student_id: student.id,
        full_name: student.full_name,
        photo: student.photo,
        isPresent: !!attMap.get(student.id),
      }));

      return {
        success: true,
        message: "Dars yangilandi",
        data: {
          lesson: {
            id: updatedLesson.id,
            topic: updatedLesson.topic,
            description: updatedLesson.description,
            created_at: updatedLesson.created_at,
          },
          attendance: attendanceList,
        },
      };
    }

    // Otherwise create new lesson and attendances
    const lesson = await this.prisma.$transaction(async (tx) => {
      const l = await tx.lesson.create({
        data: {
          group_id: groupId,
          topic: payload.topic,
          description: payload.description,
          created_at: startOfDay,
        },
      });

      if (payload.attendances?.length) {
        await tx.attendance.createMany({
          data: payload.attendances.map((a) => ({
            lesson_id: l.id,
            student_id: a.student_id,
            isPresent: a.isPresent,
            created_at: startOfDay,
          })),
        });
      }

      return l;
    });

    // build attendance list for response
    const attendances = await this.prisma.attendance.findMany({
      where: { lesson_id: lesson.id },
      include: { students: { select: { id: true, full_name: true, photo: true } } },
    });

    const groupStudents = await this.prisma.studentGroup.findMany({
      where: { group_id: groupId, status: Status.active },
      select: { students: { select: { id: true, full_name: true, photo: true } } },
    });
    const students = groupStudents.map((el) => el.students);

    const attMap = new Map(attendances.map((a) => [a.student_id, a.isPresent]));

    const attendanceList = students.map((student) => ({
      student_id: student.id,
      full_name: student.full_name,
      photo: student.photo,
      isPresent: !!attMap.get(student.id),
    }));

    return {
      success: true,
      message: "Dars muvaffaqiyatli yaratildi",
      data: {
        lesson: {
          id: lesson.id,
          topic: lesson.topic,
          description: lesson.description,
          created_at: lesson.created_at,
        },
        attendance: attendanceList,
      },
    };
  }

  async getLessonByDate(groupId: number, dateStr: string) {
    const date = new Date(dateStr);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const lesson = await this.prisma.lesson.findFirst({
      where: {
        group_id: groupId,
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException("Bu sanada dars topilmadi.");
    }

    const attendances = await this.prisma.attendance.findMany({
      where: {
        lesson_id: lesson.id,
        lesson: {
          group_id: groupId,
        },
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        students: {
          select: {
            id: true,
            full_name: true,
            photo: true,
          },
        },
      },
    });

    const groupStudents = await this.prisma.studentGroup.findMany({
      where: {
        group_id: groupId,
        status: Status.active,
      },
      select: {
        students: {
          select: {
            id: true,
            full_name: true,
            photo: true,
          },
        },
      },
    });
    const students = groupStudents.map((el) => el.students);
    const attMap = new Map(attendances.map((a) => [a.student_id, a.isPresent]));

    const attendanceList = students.map((student) => ({
      student_id: student.id,
      full_name: student.full_name,
      photo: student.photo,
      isPresent: !!attMap.get(student.id),
    }));

    return {
      success: true,
      data: {
        lesson: lesson
          ? {
              id: lesson.id,
              topic: lesson.topic,
              description: lesson.description,
              created_at: lesson.created_at,
            }
          : null,
        attendance: attendanceList,
      },
    };
  }
}
