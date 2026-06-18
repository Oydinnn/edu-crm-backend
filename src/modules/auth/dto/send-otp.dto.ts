import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class SendOtpPhoneDto{
  @ApiProperty()
  @IsString()
  @IsPhoneNumber("UZ")
  phone: string;
}
