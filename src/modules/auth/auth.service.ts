import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService 
    ) { }

    async userLogin(payload: LoginDto) {
        let user
        const existUser = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        })

        if (!existUser) {
            const existStudent = await this.prisma.student.findUnique({
            where: {
                phone: payload.phone
                }
            })
            if (!existStudent) {
                const existTeacher = await this.prisma.teacher.findUnique({
                    where: {
                        phone: payload.phone
                    }
                })
                
                if (!existTeacher) {
                    throw new UnauthorizedException("Invalid phone or password")
                }

                user = existTeacher
                user.role = 'TEACHER'
            } 
            user = existStudent
            user.role = 'STUDENT'


        }else{
            user = existUser
        }

        const isMatch: boolean = await bcrypt.compare(payload.password, user.password)
        if (!isMatch) {
            throw new UnauthorizedException("Invalid username or password")
        }

        return {
            success: true,
            message: "You're logged",
            accessToken: this.jwtService.sign({ 
                id: user.id, 
                email: user.email, 
                role: user.role 
            }),
            role: user.role 
        }

    }

}
