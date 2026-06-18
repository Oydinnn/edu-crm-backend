// import { ApiPropertyOptional } from "@nestjs/swagger";
// import { Type } from "class-transformer";
// import { IsNumber, IsOptional } from "class-validator";

// export class PaginationDto{
//     @ApiPropertyOptional()
//     @IsOptional()
//     page?: number

//     @ApiPropertyOptional()
//     @IsOptional()
//     limit?: number
// }


// src/modules/students/dto/pagination.dto.ts
import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number;
}