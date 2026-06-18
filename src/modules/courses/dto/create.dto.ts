import { ApiProperty } from "@nestjs/swagger";
import { Status } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateCourseDto{
    @ApiProperty()
    @IsString()
    name!:string

    @ApiProperty()
    @IsOptional()
    description!:string

    @ApiProperty()
    @IsNumber()
    price!:number

    @ApiProperty()
    @IsNumber()
    duration_month!: number

    @ApiProperty()
    @IsNumber()
    duration_hours!: number

    @ApiProperty({ enum: Status, required: false, default: 'active' })
    @IsOptional()
    @IsEnum(Status)
    status?:Status 
}

