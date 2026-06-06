// import { ConflictException, Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/core/database/prisma.service';
// import { CreateStudentDto } from './dto/create.dto';
// import * as bcrypt from "bcrypt"
// import { Status } from '@prisma/client';
// import { EmailService } from 'src/common/email/email.service';
// import { PaginationDto } from './dto/pagination.dto';

// @Injectable()
// export class StudentsService {
//     constructor(
//         private prisma : PrismaService,
//         private emailService : EmailService
//     ){}

//     async getMyGroups(currentUser : { id : number}){
//         const myGroups = await this.prisma.studentGroup.findMany({
//             where:{
//                 student_id: currentUser.id
//             },
//             select:{
//                 groups:{
//                     select:{
//                         id:true,
//                         name:true
//                     }
//                 }
//             }
//         })

//         return {
//             success : true,
//             data: myGroups.map(el => el.groups)
//         }
//     }

//     async getAllStudents(pagination : PaginationDto){
//         //pagination
//         const {page,limit} = pagination
//         const students = await this.prisma.student.findMany({
//             where:{
//                 status:Status.active
//             },
//             select:{
//                 id:true,
//                 first_name:true,
//                 last_name:true,
//                 phone:true,
//                 photo:true,
//                 email:true,
//                 address:true,
//                 birth_date:true
//             },
//             skip:(limit? +limit : 10) * (page ? +page - 1 : 0),
//             take:limit? +limit : 10
//         })

//         return {
//             success:true,
//             data:students
//         }
//     }

//     async createStudent(payload : CreateStudentDto, filename? : string){

//         const existStudent = await this.prisma.student.findFirst({
//             where:{
//                 OR:[
//                     {phone:payload.phone},
//                     {email:payload.email}
//                 ]
//             }
//         })

//         if(existStudent){

//             throw new ConflictException()
//         }

//         const hashPass = await bcrypt.hash(payload.password,10)

//         await this.prisma.student.create({
//             data:{
//                 first_name:payload.first_name,
//                 last_name:payload.last_name,
//                 photo:filename ?? null,
//                 phone:payload.phone,
//                 birth_date:new Date(payload.birth_date),
//                 email:payload.email,
//                 password:hashPass,
//                 address:payload.address
//             }
//         })

//         await this.emailService.sendEmail(payload.email,payload.phone,payload.password)

//         return {
//             success:true,
//             message:"Student created"
//         }
//     }
// }

// // src/modules/students/students.service.ts
// import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/core/database/prisma.service';
// import { CreateStudentDto } from './dto/create.dto';
// import * as bcrypt from "bcrypt";
// import { Status, StudentStatus } from '@prisma/client';
// import { PaginationDto } from './dto/pagination.dto';
// import { EmailService } from 'src/common/email/email.service';

// @Injectable()
// export class StudentsService {
//     constructor(
//         private prisma: PrismaService,
//         private emailService: EmailService
//     ) {}

//     // ✅ 1. getMyGroups
//     async getMyGroups(currentUser: { id: number }) {
//         const myGroups = await this.prisma.studentGroup.findMany({
//             where: {
//                 student_id: currentUser.id,
//                 status: Status.active
//             },
//             include: {
//                 groups: {
//                     include: {
//                         courses: true,
//                         rooms: true
//                     }
//                 }
//             }
//         });

//         return {
//             success: true,
//             data: myGroups.map(el => el.groups)
//         };
//     }

//     // ✅ 2. getAllStudents
//     async getAllStudents(pagination: PaginationDto) {
//         const { page, limit } = pagination;

//         const students = await this.prisma.student.findMany({
//             where: {
//                 status: StudentStatus.active
//             },
//             select: {
//                 id: true,
//                 full_name: true,
//                 phone: true,
//                 photo: true,
//                 email: true,
//                 address: true,
//                 birth_date: true,
//                 created_at: true
//             },
//             skip: (limit ? +limit : 10) * ((page ? +page : 1) - 1),
//             take: limit ? +limit : 10,
//             orderBy: {
//                 created_at: 'desc'
//             }
//         });

//         const total = await this.prisma.student.count({
//             where: { status: StudentStatus.active }
//         });

//         return {
//             success: true,
//             data: students,
//             meta: {
//                 total,
//                 page: page ? +page : 1,
//                 limit: limit ? +limit : 10,
//                 totalPages: Math.ceil(total / (limit ? +limit : 10))
//             }
//         };
//     }

//     // ✅ 3. createStudent - TO'G'RILANGAN
//     async createStudent(payload: CreateStudentDto, filename?: string) {
//         const existStudent = await this.prisma.student.findFirst({
//             where: {
//                 OR: [
//                     { phone: payload.phone },
//                     { email: payload.email }
//                 ]
//             }
//         });

//         if (existStudent) {
//             throw new ConflictException('Student with this phone or email already exists');
//         }

//         const hashPass = await bcrypt.hash(payload.password, 10);

//         // ✅ To'g'ri format
//         // const fullName = `${payload.full_name};

//         const newStudent = await this.prisma.student.create({
//             data: {
//                 full_name: payload.full_name,
//                 photo: filename ?? null,
//                 phone: payload.phone,
//                 birth_date: new Date(payload.birth_date),
//                 email: payload.email,
//                 password: hashPass,
//                 address: payload.address
//             }
//         });

//         // ✅ Email yuborish
//         try {
//             await this.emailService.sendEmail(
//                 payload.email,
//                 payload.phone,
//                 payload.password,
//                 payload.full_name
//             );
//         } catch (emailError) {
//             console.error('Email yuborishda xatolik:', emailError);
//         }

//         return {
//             success: true,
//             message: "Student created successfully. Login credentials sent to email.",
//             data: {
//                 id: newStudent.id,
//                 full_name: payload.full_name,
//                 email: newStudent.email,
//                 phone: newStudent.phone
//             }
//         };
//     }

//     // ✅ 4. getStudentById - TO'G'RILANGAN
//     async getStudentById(id: number) {
//         const student = await this.prisma.student.findUnique({
//             where: { id, status: StudentStatus.active },
//             select: {
//                 id: true,
//                 full_name: true,
//                 phone: true,
//                 photo: true,
//                 email: true,
//                 address: true,
//                 birth_date: true,
//                 studentGroups: {
//                     where: { status: Status.active },
//                     include: {
//                         groups: {
//                             include: {
//                                 courses: true,
//                                 rooms: true
//                             }
//                         }
//                     }
//                 }
//             }
//         });

//         if (!student) {
//             throw new NotFoundException('Student not found');
//         }

//         return {
//             success: true,
//             data: student
//         };
//     }

//     // ✅ 5. updateStudent
//     async updateStudent(id: number, payload: any, filename?: string) {
//         const student = await this.prisma.student.findUnique({
//             where: { id }
//         });

//         if (!student) {
//             throw new NotFoundException('Student not found');
//         }

//         const updateData: any = {};

//         if (payload.full_name) updateData.full_name = payload.full_name;
//         if (payload.email) updateData.email = payload.email;
//         if (payload.phone) updateData.phone = payload.phone;
//         if (payload.address) updateData.address = payload.address;
//         if (payload.birth_date) updateData.birth_date = new Date(payload.birth_date);
//         if (filename) updateData.photo = filename;

//         if (payload.password) {
//             updateData.password = await bcrypt.hash(payload.password, 10);
//         }

//         const updatedStudent = await this.prisma.student.update({
//             where: { id },
//             data: updateData
//         });

//         return {
//             success: true,
//             message: "Student updated successfully",
//             data: updatedStudent
//         };
//     }

//     // ✅ 6. deleteStudent
//     async deleteStudent(id: number) {
//         const student = await this.prisma.student.findUnique({
//             where: { id }
//         });

//         if (!student) {
//             throw new NotFoundException('Student not found');
//         }

//         const deletedStudent = await this.prisma.student.update({
//             where: { id },
//             data: { status: StudentStatus.inactive }
//         });

//         if (student.photo) {
//             const fs = require('fs');
//             const path = `./src/uploads/${student.photo}`;
//             if (fs.existsSync(path)) {
//                 fs.unlinkSync(path);
//             }
//         }

//         return {
//             success: true,
//             message: "Student deleted successfully"
//         };
//     }
// }

// src/modules/students/students.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateStudentDto } from "./dto/create.dto";
import * as bcrypt from "bcrypt";
import { Status, StudentStatus } from "@prisma/client";
import { PaginationDto } from "./dto/pagination.dto";
import { EmailService } from "src/common/email/email.service";
import { log } from "console";
import { logger } from "handlebars";
import { filterDto } from "./dto/search";
import { UpdateStudentDto } from "./dto/update.dto";
import { CreateHomeworkAnswerDto } from "./dto/createHomeworkAnswer.dto";
import { Role } from "@prisma/client";

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // ✅ 1. getMyGroups
  async getMyGroups(currentUser: { id: number}) {
    const myGroups = await this.prisma.studentGroup.findMany({
      where: {
        student_id: currentUser.id,
      },
      select:{
        groups:{
          select:{
            id: true,
            name: true,
            status:true,
            start_date:true,
            week_day: true,
            start_time: true,
            courses:{
              select:{
                name: true,
                duration_hours: true,
              }
            },
            _count:{
              select:{
                groupTeachers: true,
              }
            },
            groupTeachers:{
              select:{
                teacher:{
                  select:{
                    id:true,
                    full_name:true,
                    
                  }
                }
              }
            } 
          }
        }
      }
    });

    const formattedGroup = myGroups.map((el) => ({
      groupName: el.groups.name,
      courseName: el.groups.courses.name,
      teacherCount: el.groups._count.groupTeachers,
      startDate: el.groups.start_date,
      groupId: el.groups.id,
      status: el.groups.status,
      weekDay: el.groups.week_day,
      startTime: el.groups.start_time,
      teachers: el.groups.groupTeachers.map(teacher => ({
        full_name: teacher.teacher.full_name,
        week_day: el.groups.week_day,
        role: "TEACHER",
        start_time: el.groups.start_time,
        duration_hours: el.groups.courses.duration_hours,
      }))
    }));

    return {
      success: true,
      data: formattedGroup,
    };
  }

  // ✅ 2. getAllStudents - full_name bilan
  async getAllStudents(pagination: PaginationDto, search: filterDto) {
    const { page, limit } = pagination;
    const { full_name, phone, status } = search;
    let searchWhere = {};

    if (status) {
      searchWhere["status"] = status;
    } else {
      searchWhere["status"] = "active"; // default
    }

    if (full_name) searchWhere["full_name"] = full_name;
    if (phone) searchWhere["phone"] = phone;

    const students = await this.prisma.student.findMany({
      where: searchWhere,
      select: {
        id: true,
        full_name: true, // ✅ full_name
        phone: true,
        photo: true,
        email: true,
        address: true,
        birth_date: true,
        created_at: true,
        status: true,
        studentGroups: {
          select: {
            groups: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      skip: (limit ? +limit : 10) * ((page ? +page : 1) - 1),
      take: limit ? +limit : 10,
      orderBy: {
        created_at: "desc",
      },
    });

    const total = await this.prisma.student.count({
      where: searchWhere,
    });

    const formattedStudents = students.map((student) => {
      return {
        id: student.id,
        full_name: student.full_name,
        photo: student.photo,
        phone: student.phone,
        email: student.email,
        status: student.status,
        address: student.address,
        birth_date: student.birth_date,
        created_at: student.created_at,
        groups: student.studentGroups.map((group) => group.groups),
      };
    });
    

    return {
      success: true,
      data: formattedStudents,
      meta: {
        total,
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
        totalPages: Math.ceil(total / (limit ? +limit : 10)),
      },
    };
  }

  // ✅ 3. createStudent - full_name bilan
  async createStudent(payload: CreateStudentDto, filename?: string) {
    const { groups, ...rest } = payload;

    const existStudent = await this.prisma.student.findFirst({
      where: {
        OR: [{ phone: payload.phone }, { email: payload.email }],
      },
    });

    if (existStudent) {
      throw new ConflictException(
        "Student with this phone or email already exists",
      );
    }

    const hashPass = await bcrypt.hash(payload.password, 10);

    const student = await this.prisma.student.create({
      data: {
        full_name: payload.full_name, // ✅ full_name
        photo: filename ?? null,
        phone: payload.phone,
        birth_date: new Date(payload.birth_date),
        email: payload.email,
        password: hashPass,
        address: payload.address,
      },
    });

    if (groups && groups.length > 0) {
  const validGroups = groups.filter((id) => !isNaN(id) && id > 0);
  if (validGroups.length > 0) {
    await this.prisma.studentGroup.createMany({
      data: validGroups.map((group_id) => ({
        student_id: student.id,
        group_id,
      })),
    });
  }
}

    // ✅ Email yuborish
    try {
      await this.emailService.sendEmail(
        payload.email,
        payload.phone,
        payload.password,
        payload.full_name, // ✅ full_name
      );
    } catch (emailError) {
      console.error("Email yuborishda xatolik:", emailError);
    }

    return {
      success: true,
      message: "Student created successfully. Login credentials sent to email.",
      data: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        phone: student.phone,
        groups: groups ?? []
      },
    };
  }

  // ✅ 4. getStudentById - full_name bilan
  async getStudentById(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id, status: StudentStatus.active },
      select: {
        id: true,
        full_name: true, // ✅ full_name
        phone: true,
        photo: true,
        email: true,
        address: true,
        birth_date: true,
        studentGroups: {
          where: { status: Status.active },
          include: {
            groups: {
              include: {
                courses: true,
                rooms: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    return {
      success: true,
      data: student,
    };
  }

  // ✅ 5. updateStudent - full_name bilan
  async updateStudent(id: number, payload: UpdateStudentDto, filename?: string) {
    const { status, groups, ...rest } = payload;

    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException("Student not found");
    }


    const updateData: any = {};

    if (payload.full_name) updateData.full_name = payload.full_name;
    if (payload.email) updateData.email = payload.email;
    if (payload.phone) updateData.phone = payload.phone;
    if (payload.address) updateData.address = payload.address;
    if(payload.status) updateData.status = payload.status;
    if (payload.birth_date)
      updateData.birth_date = new Date(payload.birth_date);
    if (filename) updateData.photo = filename;
    

    if (payload.password) {
      updateData.password = await bcrypt.hash(payload.password, 10);
    }

    const updatedStudent = await this.prisma.student.update({
      where: { id },
      data: updateData,
    });

     if (groups && Array.isArray(groups)) {
    await this.prisma.studentGroup.deleteMany({ where: { student_id: id } });
    const validGroups = groups.filter((gId) => !isNaN(gId) && gId > 0);
    if (validGroups.length > 0) {
      await this.prisma.studentGroup.createMany({
        data: validGroups.map((group_id) => ({ student_id: id, group_id })),
      });
    }
  }

    

    return {
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    };
  }



//   

    async toggleStatus(id: number, status: StudentStatus) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException(`Student topilmadi`);

    return this.prisma.student.update({
        where: { id },
        data: { status }, // faqat status yangilanadi
    });
    }
  

  // ✅ 6. deleteStudent
  async deleteStudent(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    const deletedStudent = await this.prisma.student.update({
      where: { id },
      data: { status: StudentStatus.inactive },
    });

    if (student.photo) {
      const fs = require("fs");
      const path = `./src/uploads/${student.photo}`;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }

    return {
      success: true,
      message: "Student deleted successfully",
    };
  }

  // ✅ 7. Qo'shimcha: search by full_name
  async searchStudents(search: string) {
    const students = await this.prisma.student.findMany({
      where: {
        status: StudentStatus.active,
        full_name: {
          contains: search,
          mode: "insensitive", // katta/kichik harf farqi yo'q
        },
      },
      select: {
        id: true,
        full_name: true,
        phone: true,
        email: true,
        photo: true,
      },
      take: 10,
    });

    return {
      success: true,
      data: students,
    };
  }



   async createHomeworkAnswer(homeworkId: number, currentUser:{id:number}, payload: CreateHomeworkAnswerDto, filename?: string){
    const existHomework = await this.prisma.homework.findFirst({
      where:{
        id: homeworkId,
      }
    })
    if(!existHomework){
      throw new NotFoundException("Homework not found with this id")
    }

    const existHomeworkAnswer = await this.prisma.homeworkAnswerStudent.findFirst({
      where:{
        homework_id: homeworkId,
        student_id: currentUser.id,
      }
    })

    if(existHomeworkAnswer){  
      throw new ConflictException("You have already answered this homework")
    }

    await this.prisma.homeworkAnswerStudent.create({
      data:{
        homework_id: homeworkId,
        student_id: currentUser.id,
        title: payload.title,
        file: filename??null,
      }
    })

    return {
      success: true,
      message: "Homework answer recorded"
    }
}
}
