import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAdminDto } from './dto/create.admin.dto';
import * as bcrypt from "bcrypt"
import { Role, Status } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getAllAdmins(){
        const admins = await this.prisma.user.findMany({
            where:{
                status:Status.active,
                role: Role.ADMIN
            },
            select:{
                id:true,
                first_name:true,
                last_name:true,
                email:true,
                phone:true,
                photo:true,
                role:true,

            }
        })

        return {
            success:true,
            data:admins
        }
    }

    async createAdmin(payload : CreateAdminDto) {
        const adminExists = await this.prisma.user.findFirst({
            where:{
                OR:[
                    {phone:payload.phone},
                    {email:payload.email}
                ]
                
            }
        })

        if(adminExists) throw new ConflictException()

        const hashPass = await bcrypt.hash(payload.password,10)

        await this.prisma.user.create({
            data:{
                ...payload,
                role:Role.ADMIN,
                password:hashPass
            }
        })

        return {
            success:true,
            message:"create admin successfully"
        }
    }

    async getMe(userId: number, role: string) {
        let profile: any = null;
        if (role === Role.SUPERADMIN || role === Role.ADMIN) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId }
            });
            if (user) {
                profile = {
                    id: user.id,
                    full_name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    phone: user.phone,
                    photo: user.photo,
                    role: user.role
                };
            }
        } else if (role === Role.TEACHER) {
            const teacher = await this.prisma.teacher.findUnique({
                where: { id: userId },
                include: {
                    groupTeachers: {
                        include: {
                            group: true
                        }
                    }
                }
            });
            if (teacher) {
                profile = {
                    id: teacher.id,
                    full_name: teacher.full_name,
                    email: teacher.email,
                    phone: teacher.phone,
                    photo: teacher.photo,
                    address: teacher.address,
                    status: teacher.status,
                    created_at: teacher.created_at,
                    role: 'TEACHER',
                    groups: teacher.groupTeachers.map(gt => ({
                        id: gt.group.id,
                        name: gt.group.name
                    }))
                };
            }
        } else if (role === Role.STUDENT) {
            const student = await this.prisma.student.findUnique({
                where: { id: userId },
                include: {
                    studentGroups: {
                        include: {
                            groups: true
                        }
                    }
                }
            });
            if (student) {
                profile = {
                    id: student.id,
                    full_name: student.full_name,
                    email: student.email,
                    phone: student.phone,
                    photo: student.photo,
                    birth_date: student.birth_date,
                    address: student.address,
                    status: student.status,
                    created_at: student.created_at,
                    role: 'STUDENT',
                    groups: student.studentGroups.map(sg => ({
                        id: sg.groups.id,
                        name: sg.groups.name
                    }))
                };
            }
        }

        return {
            success: !!profile,
            data: profile
        };
    }

    async getDashboardStats() {
        const [groups, courses, students, teachers] = await Promise.all([
            this.prisma.group.count(),
            this.prisma.course.count(),
            this.prisma.student.count(),
            this.prisma.teacher.count()
        ]);

        return {
            success: true,
            data: {
                groups,
                courses,
                students,
                teachers
            }
        };
    }

}

