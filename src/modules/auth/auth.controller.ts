import { Body, Controller, Post, Put } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { SendOtpPhoneDto} from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Post("login")
    userLogin(@Body() payload : LoginDto){
        return this.authService.userLogin(payload)
    }

    @Post('send-otp')
    sendOtpPhone(@Body() payload : SendOtpPhoneDto){
        return this.authService.sendOtpPhone(payload)
    }

    @Post('verify-otp')
    verifyOtp(@Body() payload : VerifyOtpDto){
        return this.authService.verifyOtp(payload)
    }
    
    @Post('refresh-token')
    refreshToken(@Body() payload : RefreshTokenDto){
        return this.authService.refreshToken(payload)
    }

    @Put('change-password')
    changePassword(@Body() payload: UpdatePasswordDto){
        return this.authService.changePassword(payload)
    }
    
}
