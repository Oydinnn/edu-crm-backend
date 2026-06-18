import {  ApiPropertyOptional } from "@nestjs/swagger";
import { StudentStatus } from "@prisma/client";
import { IsEnum, IsMobilePhone, IsOptional, IsString } from "class-validator";

export class filterDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    full_name: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsMobilePhone()
    phone: string

    @ApiPropertyOptional()
    @IsOptional()  
    @IsEnum(StudentStatus)
    status?: StudentStatus;

}