import { ApiProperty } from "@nestjs/swagger";
import {  WeekDay } from "@prisma/client";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateGroupDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsOptional()
    description: string

    @ApiProperty()
    @IsNumber()
    course_id: number

    @ApiProperty()
    @IsNumber()
    room_id: number

    @ApiProperty()
    @IsDateString()
    start_date: string

    @ApiProperty({ enum: WeekDay, isArray: true })
    @IsEnum(WeekDay, { each: true })
    week_day: WeekDay[];

    @ApiProperty()
    @IsString()
    start_time: string

    @ApiProperty()
    @IsNumber()
    max_student: number

    @ApiProperty({type: [Number], example: [1, 2]})
    @IsOptional()
    @IsNumber()
    teachers?: number[]


    @ApiProperty({type: [Number], example: [1, 2]})
    @IsOptional()
    @IsNumber()
    students?: number[]
}

