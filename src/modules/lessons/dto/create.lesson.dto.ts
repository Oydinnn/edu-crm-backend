import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class AttendanceDto {
  @ApiProperty()
  @IsNumber()
  student_id: number;

  @ApiProperty()
  @IsBoolean()
  isPresent: boolean;
}

export class CreateLessonDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  group_id?: number;

  @ApiProperty()
  @IsString()
  topic: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [AttendanceDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttendanceDto)
  attendances?: AttendanceDto[]; // ✅ optional
}
