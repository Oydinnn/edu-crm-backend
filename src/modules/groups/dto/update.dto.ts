import { ApiPropertyOptional } from "@nestjs/swagger";
import { WeekDay } from "@prisma/client";
import { Type } from "class-transformer";
import { GroupStatus } from "@prisma/client";
import { IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateGroupDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    course_id?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    room_id?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    start_date?: string

    @ApiPropertyOptional({ enum: WeekDay, isArray: true })
    @IsOptional()
    @IsEnum(WeekDay, { each: true })
    week_day?: WeekDay[]

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    start_time?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    max_student?: number

    @ApiPropertyOptional({ type: [Number], example: [1, 2] })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    teachers?: number[]

    @ApiPropertyOptional({ type: [Number], example: [1, 2] })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    students?: number[]


    @ApiPropertyOptional({ enum: GroupStatus })
    @IsOptional()
    @IsEnum(GroupStatus)
    status?: GroupStatus 
}