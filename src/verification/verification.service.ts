// import { BadRequestException, Injectable } from "@nestjs/common";
// import { PrismaService } from "src/core/database/prisma.service";
// import { RedisService } from "src/common/redis/redis.service";
// import { SendOtpDto } from "./dto/send-otp.dto";
// import { VerifyOtpDto } from "./dto/verify-otp.dto";

// @Injectable()
// export class VerificationService {
//   constructor(
//     private redis: RedisService,
//     private prisma: PrismaService,
//   ) {}

//   private getMessage(otp: string) {
//     // return `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;

//     return `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
//   }

//   async sendOtp(dto: SendOtpDto) {
//     // Telefon raqam allaqachon ro'yxatdan o'tganmi?
//     const existingUser = await this.prisma.user.findUnique({
//       where: { phone: dto.phone },
//     });

//     if (existingUser) {
//       throw new BadRequestException(
//         "Bu telefon raqam allaqachon ro'yxatdan o'tgan",
//       );
//     }

//     // 6 xonalik OTP yaratish
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Redis ga saqlash (5 daqiqa)
//     await this.redis.setWithTTL(`otp:${dto.phone}`, otp, 300);

//     // TODO: SMS xizmatga ulash
//     console.log(`📱 OTP for ${dto.phone}: ${otp}`);
//     // await this.smsService.sendSMS(this.getMessage(otp),dto.phone)

//     return {
//       success: true,
//       message: "OTP code sent successfully",
//       data: { expiresIn: 300 }, // 5 daqiqa
//     };
//   }

//   async verifyOtp(dto: VerifyOtpDto) {
//     // OTP ni Redis dan olish
//     const storedOtp = await this.redis.get(`otp:${dto.phone}`);

//     if (!storedOtp) {
//       throw new BadRequestException("OTP code expired or not found");
//     }

//     if (storedOtp !== dto.otp) {
//       throw new BadRequestException("Invalid OTP code");
//     }

//     // OTP ni o'chirish
//     await this.redis.del(`otp:${dto.phone}`);

//     // Telefon raqamni tasdiqlangan deb belgilash
//     // (session yoki temporary token yaratish)
//     const verificationToken = this.generateVerificationToken(dto.phone);

//     return {
//       success: true,
//       message: "Phone number verified successfully",
//       data: {
//         verificationToken, // Bu token bilan register qilish mumkin
//         phone: dto.phone,
//       },
//     };
//   }

//   private generateVerificationToken(phone: string): string {
//     // Simple token (real production da JWT ishlating)
//     return Buffer.from(`${phone}:${Date.now()}`).toString("base64");
//   }
// }
