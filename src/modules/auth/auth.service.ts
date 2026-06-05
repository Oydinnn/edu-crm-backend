// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from 'src/core/database/prisma.service';
// import { LoginDto } from './dto/login.dto';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { Role } from '@prisma/client';

// @Injectable()
// export class AuthService {
//     constructor(
//         private prisma: PrismaService,
//         private jwtService: JwtService 
//     ) { }

//     async userLogin(payload: LoginDto) {
//         let user
//         const existUser = await this.prisma.user.findUnique({
//             where: {
//                 phone: payload.phone
//             }
//         })

//         if (!existUser) {
//             const existStudent = await this.prisma.student.findUnique({
//             where: {
//                 phone: payload.phone
//                 }
//             })
//             if (!existStudent) {
//                 const existTeacher = await this.prisma.teacher.findUnique({
//                     where: {
//                         phone: payload.phone
//                     }
//                 })
                
//                 if (!existTeacher) {
//                     throw new UnauthorizedException("Invalid phone or password")
//                 }

//                 user = existTeacher
//                 user.role = 'TEACHER'
//             } 
//             user = existStudent
//             user.role = 'STUDENT'


//         }else{
//             user = existUser
//         }

//         const isMatch: boolean = await bcrypt.compare(payload.password, user.password)
//         if (!isMatch) {
//             throw new UnauthorizedException("Invalid username or password")
//         }

//         return {
//             success: true,
//             message: "You're logged",
//             role: user.role,
//             accessToken: this.jwtService.sign({ 
//                 id: user.id, 
//                 email: user.email, 
//                 role: user.role 
//             }),
//         }

//     }

// }



import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role, Student, Teacher, User } from '@prisma/client';

// Union type - barcha modellarni birlashtiruvchi tur
type AuthUser = (User | Student | Teacher) & { role?: Role };

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService 
    ) { }

    async userLogin(payload: LoginDto) {
        // 1. Avval userni topish
        let user: AuthUser | null = null;
        let userRole: Role | null = null;
        
        // Userni User jadvalidan qidirish
        const existUser = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        });

        if (existUser) {
            user = existUser;
            user.role = existUser.role;  // User jadvalidagi role ni ishlatish
        } 
        
        // Agar User jadvalida topilmasa, Student jadvalidan qidirish
        if (!user) {
            const existStudent = await this.prisma.student.findUnique({
                where: {
                    phone: payload.phone
                }
            });
            
            if (existStudent) {
                user = existStudent;
                user.role = Role.STUDENT;  // 'STUDENT' qilib o'rnatish
            }
        }
        
        // Agar Student da ham topilmasa, Teacher jadvalidan qidirish
        if (!user) {
            const existTeacher = await this.prisma.teacher.findUnique({
                where: {
                    phone: payload.phone
                }
            });
            
            if (existTeacher) {
                user = existTeacher;
                user.role = Role.TEACHER;  // 'TEACHER' qilib o'rnatish
            }
        }
        
        // 2. Agar user topilmasa, xatolik
        if (!user) {
            throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
        }

        // 3. Parolni tekshirish
        const isMatch: boolean = await bcrypt.compare(payload.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
        }

        // 4. Tokenni yaratish va qaytarish
        return {
            success: true,
            message: "Tizimga muvaffaqiyatli kirdingiz",
            role: user.role,
            accessToken: this.jwtService.sign({ 
                id: user.id, 
                phone: user.phone,
                email: user.email || null, 
                role: user.role 
            }),
        }
    }
}