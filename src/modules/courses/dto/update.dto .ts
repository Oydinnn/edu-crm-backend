import { ApiProperty } from "@nestjs/swagger";
import { Status } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateCourseDto{
    @ApiProperty()
    @IsOptional()
    @IsString()
    name!:string

    @ApiProperty()
    @IsOptional()
    description!:string

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    price!:number

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    duration_month!: number

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    duration_hours!: number

    @ApiProperty({ enum: Status, required: false, default: 'active' })
    @IsOptional()
    @IsEnum(Status)
    status?:Status 
}

