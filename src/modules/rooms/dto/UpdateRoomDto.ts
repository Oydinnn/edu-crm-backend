import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer'; // ← Добавь импорт

export class UpdateRoomDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Transform(({ value }) => 
        value === '' || value === null || value === undefined ? undefined : Number(value)
    )
    @IsNumber()
    capacity?: number;
}