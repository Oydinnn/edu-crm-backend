// import { Controller, Post, Body } from '@nestjs/common';
// import { ApiTags, ApiOperation } from '@nestjs/swagger';
// import { VerificationService } from './verification.service';
// import { SendOtpDto } from './dto/send-otp.dto';
// import { VerifyOtpDto } from './dto/verify-otp.dto';

// @ApiTags('Verification')
// @Controller('verification')
// export class VerificationController {
//   constructor(private readonly verificationService: VerificationService) {}

//   // @Post('send')
//   // @ApiOperation({ summary: 'Send OTP code to phone' })
//   // async sendOtp(@Body() dto: SendOtpDto) {
//   //   return this.verificationService.sendOtp(dto);
//   // }

//   // @Post('verify')
//   // @ApiOperation({ summary: 'Verify OTP code' })
//   // async verifyOtp(@Body() dto: VerifyOtpDto) {
//   //   return this.verificationService.verifyOtp(dto);
//   // }
// }