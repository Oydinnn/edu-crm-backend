import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: "+998975661099" })
    @IsString()
    @IsNotEmpty()
    phone!: string;

    @ApiProperty({ example: "Benazir99!" })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password!: string;
}