import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

export class UpdatePasswordDto{
  @ApiProperty()
  @IsString()
  @IsPhoneNumber("UZ")
  phone:string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}