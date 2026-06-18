import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class VerifyOtpDto{
  @ApiProperty()
  @IsString()
  phone:string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp:string
}
