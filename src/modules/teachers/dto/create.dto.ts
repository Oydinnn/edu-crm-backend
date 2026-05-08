import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEmail, IsOptional, IsString, Matches } from "class-validator"


export class CreateTeacherDto {
    @ApiProperty()
    @IsString()
    full_name: string

    @ApiProperty()
    @IsString()
    password: string

    @ApiProperty()
    @Matches(/^998(50|90|91|93|94|95|97|98|99|20|77|33|88|71|78|70|55|87|25)\d{7}$/,{
        message: `Telefon raqam noto'g'ri formatda`,
    })
    phone: string

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    address: string

    @ApiProperty({type: [Number], example: [1, 2]})
    @IsOptional()
    @Transform(({ value}) =>{
        if(!value) return []
        if(typeof(value) === 'string'){
            return value.split(',').map((v) =>Number(v.trim()))
        }
        if(Array.isArray(value)){
            return value.map((v) => Number(v))
        }
        return[]
    },{toClassOnly:true})
    groups?: number[]

}