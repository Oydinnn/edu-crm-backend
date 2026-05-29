import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class HomeworkResultDto {
  @ApiProperty()
  @IsNumber()  
  @Type(() => Number)
  grade: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  homework_answer_id: number;

}