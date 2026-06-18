import {  ApiPropertyOptional } from "@nestjs/swagger";
import { GroupStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class filterDto {
    @ApiPropertyOptional()
    @IsOptional()
    groupName? : string

    @ApiPropertyOptional()
    @IsOptional()
    max_student? : number

    @ApiPropertyOptional()
    @IsEnum(GroupStatus)
    @IsOptional()
    status?: GroupStatus;
}