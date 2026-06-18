import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role, Student, Teacher, User } from '@prisma/client';
import { RedisService } from 'src/common/redis/redis.service';
import { EskizService } from 'src/common/services/sms';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtGenerateToken } from 'src/common/utills/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Union type - barcha modellarni birlashtiruvchi tur
type AuthUser = (User | Student | Teacher) & { role?: Role };

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService ,
        private redisService: RedisService,
        private eskizService: EskizService,
        private jwtGenerateToken: JwtGenerateToken
    ) { }
    private otpGenerate(){
        return Math.floor(1000 + Math.random() * 9000).toString()
    }
    private async sendOtp(phone: string){
        const code = Number(this.otpGenerate())
        await this.redisService.set(phone, code)
        await this.eskizService.sendSms(phone,`Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${code}. Kodni hech kimga bermang!`)
    }

    private async verifyPhoneOtp(phone: string){
        const isVerify = await this.redisService.get(phone + '_verify')

        if(!isVerify){
            throw new UnauthorizedException('Otp not verified')
        }
    }

    async userLogin(payload: LoginDto) {
        // Userni User jadvalidan qidirish
        const existUser = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        });

        if (!existUser) {
            const existStudent = await this.prisma.student.findUnique({
                where: {
                    phone: payload.phone
                }
            });
            
            if (!existStudent) {
                const existTeacher = await this.prisma.teacher.findUnique({
                    where: {
                        phone: payload.phone
                    }
                });
                
                if (!existTeacher) {
                throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
                }

                // 3. Parolni tekshirish
                const isMatch: boolean = await bcrypt.compare(payload.password, existTeacher.password);
                if (!isMatch) {
                    throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
                }

                // 4. Tokenni yaratish va qaytarish
                return {
                    success: true,
                    message: "Tizimga muvaffaqiyatli kirdingiz",
                    role: Role.TEACHER,
                    accessToken: this.jwtGenerateToken.generateAccessToken({id: existTeacher.id, email: existTeacher.email, role: Role.TEACHER}),
                    refreshToken: this.jwtGenerateToken.generateRefreshToken({id: existTeacher.id, email: existTeacher.email, role: Role.TEACHER})
                }
            }

            // 3. Parolni tekshirish
            const isMatch: boolean = await bcrypt.compare(payload.password, existStudent.password);
            if (!isMatch) {
                throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
            }

            // 4. Tokenni yaratish va qaytarish
            return {
                success: true,
                message: "Tizimga muvaffaqiyatli kirdingiz",
                role: Role.STUDENT,
                accessToken: this.jwtGenerateToken.generateAccessToken({id: existStudent.id, email: existStudent.email, role: Role.STUDENT}),
                refreshToken: this.jwtGenerateToken.generateRefreshToken({id: existStudent.id, email: existStudent.email, role: Role.STUDENT})
            }
        }

        // 3. Parolni tekshirish
        const isMatch: boolean = await bcrypt.compare(payload.password, existUser.password);
        if (!isMatch) {
            throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
        }

        // 4. Tokenni yaratish va qaytarish
        return {
            success: true,
            message: "Tizimga muvaffaqiyatli kirdingiz",
            role: existUser.role,
            accessToken: this.jwtGenerateToken.generateAccessToken({id: existUser.id, email: existUser.email, role: existUser.role}),
            refreshToken: this.jwtGenerateToken.generateRefreshToken({id: existUser.id, email: existUser.email, role: existUser.role})
        }
    }

    async sendOtpPhone(payload: { phone: string }) {

        // Telefon raqamni tekshirish
        const existUser = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        });
        
        if (!existUser) {
            const existStudent = await this.prisma.student.findUnique({
                where: {
                    phone: payload.phone
                }
            });
            
            if (!existStudent) {
                const existTeacher = await this.prisma.teacher.findUnique({
                    where: {
                        phone: payload.phone
                    }
                });
                
                if (!existTeacher) {
                    throw new UnauthorizedException("Telefon raqam tizimda mavjud emas");
                }
                await this.sendOtp(payload.phone)
                return { 
                success: true, 
                message: "Telefon raqam tizimda mavjud",
                role: Role.TEACHER
            };
            }
            await this.sendOtp(payload.phone)
            return { 
                success: true, 
                message: "Telefon raqam tizimda mavjud",
                role: Role.STUDENT
            };
        }
        await this.sendOtp(payload.phone)
        return { 
            success: true, 
            message: "Phone verified successfully!\nTelefon raqam tizimda mavjud!" ,
            role: existUser.role
        };
    }

    async verifyOtp(payload: VerifyOtpDto){
        const existOtp = await this.redisService.get(payload.phone)

        if(!existOtp){
            throw new UnauthorizedException("Otp expired")
        }

        if(String(existOtp) !== String(payload.otp)){
            throw new UnauthorizedException("Invalid Otp")
        }

        await this.redisService.del(payload.phone)
        await this.redisService.set(payload.phone + '_verify', 1)
        return {
            success: true,
            message: "Otp verified succesfully"
        }
    }

    async changePassword(payload: UpdatePasswordDto){
        const existUser = await this.prisma.user.findUnique({
            where:{
                phone: payload.phone
            }
        })

        if(!existUser){
            const existStudent = await this.prisma.student.findUnique({
                where:{
                    phone: payload.phone
                }
            })
            if(!existStudent){
                const existTeacher = await this.prisma.teacher.findUnique({
                    where: {
                        phone: payload.phone
                    }
                });
                if(!existTeacher){
                    throw new NotFoundException('Phone not found')
                }
                const hashPass = await bcrypt.hash(payload.password, 10)

                await this.verifyPhoneOtp(payload.phone)
                await this.prisma.teacher.update({
                    where:{
                        phone: payload.phone
                    },
                    data:{
                        password: hashPass
                    }
                })
                return{
                    success: true,
                    message: 'Password changed succesfully'
                }
            }
            const hashPass = await bcrypt.hash(payload.password, 10)
            await this.verifyPhoneOtp(payload.phone)
            await this.prisma.student.update({
                where:{
                    phone: payload.phone
                },
                data:{
                    password: hashPass
                }
            })
            return{
                success: true,
                message: 'Password changed succesfully'
            }
        }
        const hashPass = await bcrypt.hash(payload.password, 10)
        await this.verifyPhoneOtp(payload.phone)
        await this.prisma.user.update({
            where:{
                phone: payload.phone
            },
            data:{
                password: hashPass
            }
        })

        return{
            success: true,
            message: 'Password changed succesfully'
        }
    }

    async refreshToken(payload: RefreshTokenDto){
        const user = await this.jwtGenerateToken.verifyToken(payload.token)
        if(!user){
            throw new UnauthorizedException('Invalid token')
        }
        delete user.exp
        delete user.iat
        const accessToken = this.jwtGenerateToken.generateAccessToken(user)
        return{
            success: true,
            message: "Token refreshed succesfully",
            accessToken,

        }
        
    }
}











// import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from 'src/core/database/prisma.service';
// import { LoginDto } from './dto/login.dto';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { Role, Student, Teacher, User } from '@prisma/client';
// import { RedisService } from 'src/common/redis/redis.service';
// import { EskizService } from 'src/common/services/sms';
// import { UpdatePasswordDto } from './dto/update-password.dto';
// import { VerifyOtpDto } from './dto/verify-otp.dto';
// import { JwtGenerateToken } from 'src/common/utills/jwt';

// // Union type - barcha modellarni birlashtiruvchi tur
// type AuthUser = (User | Student | Teacher) & { role?: Role };

// @Injectable()
// export class AuthService {
//     constructor(
//         private prisma: PrismaService,
//         private jwtService: JwtService ,
//         private redisService: RedisService,
//         private eskizService: EskizService,
//         private jwtGenerateToken: JwtGenerateToken
//     ) { }
//     private otpGenerate(){
//         return Math.floor(1000 + Math.random() * 9000).toString()
//     }
//     private async sendOtp(phone: string){
//         const code = Number(this.otpGenerate())
//         await this.redisService.set(phone, code)
//         await this.eskizService.sendSms(phone,`Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${code}. Kodni hech kimga bermang!`)
//     }

//     private async verifyPhoneOtp(phone: string){
//         const isVerify = await this.redisService.get(phone + '_verify')

//         if(!isVerify){
//             throw new UnauthorizedException('Otp not verified')
//         }
//     }

//     async userLogin(payload: LoginDto) {
//         // 1. Avval userni topish
//         let user: AuthUser | null = null;
//         let userRole: Role | null = null;
        
//         // Userni User jadvalidan qidirish
//         const existUser = await this.prisma.user.findUnique({
//             where: {
//                 phone: payload.phone
//             }
//         });

//         if (!existUser) {
//             user = existUser;
//             user.role = existUser.role;  // User jadvalidagi role ni ishlatish
//         } 
        
//         // Agar User jadvalida topilmasa, Student jadvalidan qidirish
//         if (!user) {
//             const existStudent = await this.prisma.student.findUnique({
//                 where: {
//                     phone: payload.phone
//                 }
//             });
            
//             if (existStudent) {
//                 user = existStudent;
//                 user.role = Role.STUDENT;  // 'STUDENT' qilib o'rnatish
//             }
//         }
        
//         // Agar Student da ham topilmasa, Teacher jadvalidan qidirish
//         if (!user) {
//             const existTeacher = await this.prisma.teacher.findUnique({
//                 where: {
//                     phone: payload.phone
//                 }
//             });
            
//             if (existTeacher) {
//                 user = existTeacher;
//                 user.role = Role.TEACHER;
//             }
//         }
        
//         // 2. Agar user topilmasa, xatolik
//         if (!user) {
//             throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
//         }

//         // 3. Parolni tekshirish
//         const isMatch: boolean = await bcrypt.compare(payload.password, user.password);
//         if (!isMatch) {
//             throw new UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
//         }

//         // 4. Tokenni yaratish va qaytarish
//         return {
//             success: true,
//             message: "Tizimga muvaffaqiyatli kirdingiz",
//             role: user.role,
//             accessToken: this.jwtGenerateToken.generateAccessToken({id: existUser?.id, email: existUser?.email, role: existUser?.role}),
//             refreshToken: this.jwtGenerateToken.generateRefreshToken({id: existUser?.id, email: existUser?.email, role: existUser?.role})
//         }
//     }

//     async sendOtpPhone(payload: { phone: string }) {

//         // Telefon raqamni tekshirish
//         const existUser = await this.prisma.user.findUnique({
//             where: {
//                 phone: payload.phone
//             }
//         });
        
//         if (!existUser) {
//             const existStudent = await this.prisma.student.findUnique({
//                 where: {
//                     phone: payload.phone
//                 }
//             });
            
//             if (!existStudent) {
//                 const existTeacher = await this.prisma.teacher.findUnique({
//                     where: {
//                         phone: payload.phone
//                     }
//                 });
                
//                 if (!existTeacher) {
//                     throw new UnauthorizedException("Telefon raqam tizimda mavjud emas");
//                 }
//                 await this.sendOtp(payload.phone)
//                 return { 
//                 success: true, 
//                 message: "Telefon raqam tizimda mavjud",
//                 role: Role.TEACHER
//             };
//             }
//             await this.sendOtp(payload.phone)
//             return { 
//                 success: true, 
//                 message: "Telefon raqam tizimda mavjud",
//                 role: Role.STUDENT
//             };
//         }
//         await this.sendOtp(payload.phone)
//         return { 
//             success: true, 
//             message: "Phone verified successfully!\nTelefon raqam tizimda mavjud!" ,
//             role: existUser.role
//         };
//     }

//     async verifyOtp(payload: VerifyOtpDto){
//         const existOtp = await this.redisService.get(payload.phone)

//         if(!existOtp){
//             throw new UnauthorizedException("Otp expired")
//         }

//         if(String(existOtp) !== String(payload.otp)){
//             throw new UnauthorizedException("Invalid Otp")
//         }

//         await this.redisService.del(payload.phone)
//         await this.redisService.set(payload.phone + '_verify', 1)
//         return {
//             success: true,
//             message: "Otp verified succesfully"
//         }
//     }

//     async changePassword(payload: UpdatePasswordDto){
//         const existUser = await this.prisma.user.findUnique({
//             where:{
//                 phone: payload.phone
//             }
//         })

//         if(!existUser){
//             const existStudent = await this.prisma.student.findUnique({
//                 where:{
//                     phone: payload.phone
//                 }
//             })
//             if(!existStudent){
//                 const existTeacher = await this.prisma.teacher.findUnique({
//                     where: {
//                         phone: payload.phone
//                     }
//                 });
//                 if(!existTeacher){
//                     throw new NotFoundException('Phone not found')
//                 }
//                 const hashPass = await bcrypt.hash(payload.password, 10)

//                 await this.verifyPhoneOtp(payload.phone)
//                 await this.prisma.teacher.update({
//                     where:{
//                         phone: payload.phone
//                     },
//                     data:{
//                         password: hashPass
//                     }
//                 })
//                 return{
//                     success: true,
//                     message: 'Password changed succesfully'
//                 }
//             }
//             const hashPass = await bcrypt.hash(payload.password, 10)
//             await this.verifyPhoneOtp(payload.phone)
//             await this.prisma.student.update({
//                 where:{
//                     phone: payload.phone
//                 },
//                 data:{
//                     password: hashPass
//                 }
//             })
//             return{
//                 success: true,
//                 message: 'Password changed succesfully'
//             }
//         }
//         const hashPass = await bcrypt.hash(payload.password, 10)
//         await this.verifyPhoneOtp(payload.phone)
//         await this.prisma.user.update({
//             where:{
//                 phone: payload.phone
//             },
//             data:{
//                 password: hashPass
//             }
//         })

//         return{
//             success: true,
//             message: 'Password changed succesfully'
//         }
//     }
// }



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
