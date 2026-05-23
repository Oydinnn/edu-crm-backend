import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDateString, IsEmail, IsMobilePhone, IsOptional, IsString } from "class-validator"


export class CreateStudentDto {
    @ApiProperty()
    @IsString()
    full_name: string

    @ApiProperty()
    @IsString()
    password: string

    @ApiProperty()
    @IsMobilePhone()
    phone: string

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsDateString()
    birth_date: string

    @ApiProperty()
    @IsString()
    address: string

    @ApiProperty({ type: [Number], example: [1, 2] })
    @IsOptional()
    @Transform(({ value }) => {
    if (!value) return [];
    if (typeof value === "string") {
        return value.split(",").map((v) => Number(v.trim()));
    }
    if (Array.isArray(value)) {
        return value.map((v) => Number(v));
    }
    return [];
    }, { toClassOnly: true })
    groups?: number[];
}
