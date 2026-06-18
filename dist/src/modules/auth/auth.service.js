"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const redis_service_1 = require("../../common/redis/redis.service");
const sms_1 = require("../../common/services/sms");
const jwt_2 = require("../../common/utills/jwt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    redisService;
    eskizService;
    jwtGenerateToken;
    constructor(prisma, jwtService, redisService, eskizService, jwtGenerateToken) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.eskizService = eskizService;
        this.jwtGenerateToken = jwtGenerateToken;
    }
    otpGenerate() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
    async sendOtp(phone) {
        const code = Number(this.otpGenerate());
        await this.redisService.set(phone, code);
        await this.eskizService.sendSms(phone, `Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${code}. Kodni hech kimga bermang!`);
    }
    async verifyPhoneOtp(phone) {
        const isVerify = await this.redisService.get(phone + '_verify');
        if (!isVerify) {
            throw new common_1.UnauthorizedException('Otp not verified');
        }
    }
    async userLogin(payload) {
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
                    throw new common_1.UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
                }
                const isMatch = await bcrypt.compare(payload.password, existTeacher.password);
                if (!isMatch) {
                    throw new common_1.UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
                }
                return {
                    success: true,
                    message: "Tizimga muvaffaqiyatli kirdingiz",
                    role: client_1.Role.TEACHER,
                    accessToken: this.jwtGenerateToken.generateAccessToken({ id: existTeacher.id, email: existTeacher.email, role: client_1.Role.TEACHER }),
                    refreshToken: this.jwtGenerateToken.generateRefreshToken({ id: existTeacher.id, email: existTeacher.email, role: client_1.Role.TEACHER })
                };
            }
            const isMatch = await bcrypt.compare(payload.password, existStudent.password);
            if (!isMatch) {
                throw new common_1.UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
            }
            return {
                success: true,
                message: "Tizimga muvaffaqiyatli kirdingiz",
                role: client_1.Role.STUDENT,
                accessToken: this.jwtGenerateToken.generateAccessToken({ id: existStudent.id, email: existStudent.email, role: client_1.Role.STUDENT }),
                refreshToken: this.jwtGenerateToken.generateRefreshToken({ id: existStudent.id, email: existStudent.email, role: client_1.Role.STUDENT })
            };
        }
        const isMatch = await bcrypt.compare(payload.password, existUser.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException("Telefon raqam yoki parol noto'g'ri");
        }
        return {
            success: true,
            message: "Tizimga muvaffaqiyatli kirdingiz",
            role: existUser.role,
            accessToken: this.jwtGenerateToken.generateAccessToken({ id: existUser.id, email: existUser.email, role: existUser.role }),
            refreshToken: this.jwtGenerateToken.generateRefreshToken({ id: existUser.id, email: existUser.email, role: existUser.role })
        };
    }
    async sendOtpPhone(payload) {
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
                    throw new common_1.UnauthorizedException("Telefon raqam tizimda mavjud emas");
                }
                await this.sendOtp(payload.phone);
                return {
                    success: true,
                    message: "Telefon raqam tizimda mavjud",
                    role: client_1.Role.TEACHER
                };
            }
            await this.sendOtp(payload.phone);
            return {
                success: true,
                message: "Telefon raqam tizimda mavjud",
                role: client_1.Role.STUDENT
            };
        }
        await this.sendOtp(payload.phone);
        return {
            success: true,
            message: "Phone verified successfully!\nTelefon raqam tizimda mavjud!",
            role: existUser.role
        };
    }
    async verifyOtp(payload) {
        const existOtp = await this.redisService.get(payload.phone);
        if (!existOtp) {
            throw new common_1.UnauthorizedException("Otp expired");
        }
        if (String(existOtp) !== String(payload.otp)) {
            throw new common_1.UnauthorizedException("Invalid Otp");
        }
        await this.redisService.del(payload.phone);
        await this.redisService.set(payload.phone + '_verify', 1);
        return {
            success: true,
            message: "Otp verified succesfully"
        };
    }
    async changePassword(payload) {
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
                    throw new common_1.NotFoundException('Phone not found');
                }
                const hashPass = await bcrypt.hash(payload.password, 10);
                await this.verifyPhoneOtp(payload.phone);
                await this.prisma.teacher.update({
                    where: {
                        phone: payload.phone
                    },
                    data: {
                        password: hashPass
                    }
                });
                return {
                    success: true,
                    message: 'Password changed succesfully'
                };
            }
            const hashPass = await bcrypt.hash(payload.password, 10);
            await this.verifyPhoneOtp(payload.phone);
            await this.prisma.student.update({
                where: {
                    phone: payload.phone
                },
                data: {
                    password: hashPass
                }
            });
            return {
                success: true,
                message: 'Password changed succesfully'
            };
        }
        const hashPass = await bcrypt.hash(payload.password, 10);
        await this.verifyPhoneOtp(payload.phone);
        await this.prisma.user.update({
            where: {
                phone: payload.phone
            },
            data: {
                password: hashPass
            }
        });
        return {
            success: true,
            message: 'Password changed succesfully'
        };
    }
    async refreshToken(payload) {
        const user = await this.jwtGenerateToken.verifyToken(payload.token);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        delete user.exp;
        delete user.iat;
        const accessToken = this.jwtGenerateToken.generateAccessToken(user);
        return {
            success: true,
            message: "Token refreshed succesfully",
            accessToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        redis_service_1.RedisService,
        sms_1.EskizService,
        jwt_2.JwtGenerateToken])
], AuthService);
//# sourceMappingURL=auth.service.js.map