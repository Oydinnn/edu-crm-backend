// update.dto.ts
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, Matches } from "class-validator";

export class UpdateTeacherDto {
  @ApiPropertyOptional({ example: "Ali Valiyev" })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({ example: "StrongPass123" })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ example: "+998990009988" })
  @IsOptional()
  @Matches(/^998(50|90|91|93|94|95|97|98|99|20|77|33|88|71|78|70|55|87|25)\d{7}$/)
  phone?: string;

  @ApiPropertyOptional({ example: "teacher@mail.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "Toshkent sh. Chilonzor tumani" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: [Number], example: [1, 2] })
  @IsOptional()
  @Transform(({ value }) => {
    // JSON string yoki array ni qabul qilish
    if (!value) return undefined;
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(",").map(v => Number(v.trim()));
      }
    }
    if (Array.isArray(value)) {
      return value.map(v => Number(v));
    }
    return undefined;
  })
  groups?: number[];
}