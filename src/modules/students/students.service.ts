import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateStudentDto } from './dto/create.dto';
import * as bcrypt from "bcrypt"
import { Status } from '@prisma/client';
import { EmailService } from 'src/common/email/email.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class StudentsService {
    constructor(
        private prisma : PrismaService,
        private emailService : EmailService
    ){}

    async getMyGroups(currentUser : { id : number}){
        const myGroups = await this.prisma.studentGroup.findMany({
            where:{
                student_id: currentUser.id
            },
            select:{
                groups:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        })

        return {
            success : true,
            data: myGroups.map(el => el.groups)
        }
    }

    async getAllStudents(pagination : PaginationDto){
        //pagination
        const {page,limit} = pagination
        const students = await this.prisma.student.findMany({
            where:{
                status:Status.active
            },
            select:{
                id:true,
                first_name:true,
                last_name:true,
                phone:true,
                photo:true,
                email:true,
                address:true,
                birth_date:true
            },
            skip:(limit? +limit : 10) * (page ? +page - 1 : 0),
            take:limit? +limit : 10
        })

        return {
            success:true,
            data:students
        }
    }

    async createStudent(payload : CreateStudentDto, filename? : string){

        const existStudent = await this.prisma.student.findFirst({
            where:{
                OR:[
                    {phone:payload.phone},
                    {email:payload.email}
                ]
            }
        })

        if(existStudent){

            throw new ConflictException()
        }

        const hashPass = await bcrypt.hash(payload.password,10)

        await this.prisma.student.create({
            data:{
                first_name:payload.first_name,
                last_name:payload.last_name,
                photo:filename ?? null,
                phone:payload.phone,
                birth_date:new Date(payload.birth_date),
                email:payload.email,
                password:hashPass,
                address:payload.address
            }
        })

        await this.emailService.sendEmail(payload.email,payload.phone,payload.password)

        return {
            success:true,
            message:"Student created"
        }
    }
}
