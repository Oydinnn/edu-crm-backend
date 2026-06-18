import { ApiPropertyOptional } from "@nestjs/swagger"
import { StudentStatus } from "@prisma/client"
import { Transform } from "class-transformer"
import { IsDateString, IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString } from "class-validator"


export class UpdateStudentDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    full_name?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    password?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsMobilePhone()
    @Transform(({ value }) => value === '' ? undefined : value)
    phone?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    @Transform(({ value }) => value === '' ? undefined : value)
    email?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => value === '' ? undefined : value)
    birth_date?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address?: string

    @ApiPropertyOptional()
    @IsOptional()  
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsEnum(StudentStatus)
    status?: StudentStatus;

    // @ApiPropertyOptional({ type: [Number], example: [1, 2] })
    // @IsOptional()
    // @Transform(({ value }) => {
    //     // JSON string yoki array ni qabul qilish
    //     if (!value) return undefined;
    //     if (typeof value === "string") {
    //     try {
    //         return JSON.parse(value);
    //     } catch {
    //         return value.split(",").map(v => Number(v.trim()));
    //     }
    //     }
    //     if (Array.isArray(value)) {
    //     return value.map(v => Number(v));
    //     }
    //     return undefined;
    // })
    // groups?: number[];

    @ApiPropertyOptional({ type: [Number], example: [1, 2] })
@IsOptional()
@Transform(({ value }) => {
  if (!value) return [];
  if (typeof value === "string") return value.split(",").map((v) => Number(v.trim()));
  if (Array.isArray(value)) return value.map((v) => Number(v));
  return [];
}, { toClassOnly: true })
groups?: number[];
}