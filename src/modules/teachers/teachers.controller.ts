import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateTeacherDto } from './dto/create.dto';
import { UpdateTeacherDto } from './dto/update.dto';

@ApiBearerAuth()
@Controller('teachers')
export class TeachersController {
     constructor(private readonly teacherService: TeachersService) { }
    
        @ApiOperation({
            summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
        })
        @UseGuards(AuthGuard, RolesGuard)
        @Roles(Role.SUPERADMIN, Role.ADMIN)
        @Get()
        getAllTeachers() {
            return this.teacherService.getAllTeachers()
        }


        @ApiOperation({
            summary: `${Role.TEACHER},`
        })
        @UseGuards(AuthGuard, RolesGuard)
        @Roles(Role.TEACHER)    
        @Get('my/groups')
        getMyGroups(@Req() req) {
            return this.teacherService.getMyGroups(req.user.id)
        }


    
        @ApiOperation({
            summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
            description: "Bu endpointga admin va superadmin huquqi bor"
        })
        @UseGuards(AuthGuard, RolesGuard)
        @Roles(Role.SUPERADMIN, Role.ADMIN)
        @ApiConsumes("multipart/form-data")
        @ApiBody({
            schema: {
                type: 'object',
                properties: {
                    full_name: { type: 'string', example: "Ali" },
                    email: { type: 'string' , example: "+998990009988"},
                    // password: { type: 'string'},
                    phone: { type: 'string' },
                    photo: { type: 'string', format: 'binary' },
                    address: { type: "string" },
                    groups: {type: 'array', items: {type: 'number'}, example: [1, 2]},
                }
            }
        })
        @UseInterceptors(FileInterceptor("photo", {
            storage: diskStorage({
                destination: "./src/uploads",
                filename: (req, file, cb) => {
                    const filename = Date.now() + "." + file.mimetype.split("/")[1]
                    cb(null, filename)
                }
            }),
            fileFilter:(req,file,cb) =>{
                        const existFile = ["png","jpg","jpeg"]
            
                        if(!existFile.includes(file.mimetype.split("/")[1])){
                            cb(new UnsupportedMediaTypeException(),false)
                        }
            
                        cb(null,true)
                    }
        }))
        @Post()
        createTeacher(
            @Body() payload: CreateTeacherDto,
            @UploadedFile() file?: Express.Multer.File
        ) {
            return this.teacherService.createTeacher(payload, file?.filename)
        }

        
        // ✅ UPDATE TEACHER
        @ApiOperation({
            summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
            description: "O'qituvchini tahrirlash - admin va superadmin uchun"
        })
        @UseGuards(AuthGuard, RolesGuard)
        @Roles(Role.SUPERADMIN, Role.ADMIN)
        @ApiConsumes("multipart/form-data")
        @ApiBody({
            schema: {
            type: 'object',
            properties: {
                full_name: { type: 'string', example: "Ali" },
                email: { type: 'string' },
                password: { type: 'string', description: 'O\'zgartirishni istasa kiriting' },
                phone: { type: 'string' , example: "998990009988"},
                photo: { type: 'string', format: 'binary' },
                address: { type: "string" },
                groups: { type: 'array', items: { type: 'number' }, example: [1, 2] },
            }
            }
        })
        @UseInterceptors(FileInterceptor("photo", {
            storage: diskStorage({
            destination: "./src/uploads",
            filename: (req, file, cb) => {
                const filename = Date.now() + "." + file.mimetype.split("/")[1];
                cb(null, filename);
            }
            })
        }))
        @Patch(':id')
        updateTeacher(
            @Param('id') id: number,
            @Body() payload: UpdateTeacherDto,
            @UploadedFile() file?: Express.Multer.File
        ) {
            return this.teacherService.updateTeacher(+id, payload, file?.filename);
        }
        
        // ✅ DELETE TEACHER
        @ApiOperation({
            summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
            description: "O'qituvchini o'chirish - admin va superadmin uchun"
        })
        @UseGuards(AuthGuard, RolesGuard)
        @Roles(Role.SUPERADMIN, Role.ADMIN)
        @Delete(':id')
        deleteTeacher(@Param('id') id: number) {
            return this.teacherService.deleteTeacher(+id);
        }

        
}
