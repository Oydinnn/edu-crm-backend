import { Body, Controller, Get, Injectable, Param, ParseIntPipe, Post, Query, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';

@Controller('files')
@ApiBearerAuth()
export class FilesController {
    constructor(private readonly fileService: FilesService) { }

     
    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`,
     })
     @UseGuards(AuthGuard, RolesGuard)
     @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
     @Get(":groupId")
     async getFiles(@Param("groupId", ParseIntPipe) groupId: number){
     return this.fileService.getFiles(groupId)     
     }




     @ApiConsumes("multipart/form-data")
     @ApiBody({
        schema: {
            type: 'object',
            properties: {
                video: { type: 'string', format: 'binary' },
                originalname: { type: 'string' },
            }
        }
     })
     @UseGuards(AuthGuard, RolesGuard)
     @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
     @UseInterceptors(FileInterceptor("video", {
            storage: diskStorage({
                destination: "./src/uploads/files",
                filename: (req, file, cb) => {
                    const filename = Date.now() + "." + file.mimetype.split("/")[1]
                    cb(null, filename)
                }
            }),
            fileFilter:(req,file,cb) =>{
                const existFile = ["mp4","webm","avi", "mkv", "mov", "mpeg", "mpeg4", "3gp", "3g2", "flv", "wmv", "rm", "rmvb", "ogv", "asf", "m2v", "m4v", "mpg", "mpeg4", "vob", "mkv"]
    
                if(!existFile.includes(file.mimetype.split("/")[1])){
                    cb(new UnsupportedMediaTypeException("Faqat video fayllar ruxsat etilgan"),false)
                }
    
                cb(null,true)
            }
        }))
    @Post('upload')
    async uploadFile(
        @Query("lessonId", ParseIntPipe) lessonId: number,
        @Query("groupId", ParseIntPipe) groupId: number,
        @Body("originalname") originalname: string,
        @UploadedFile() file: Express.Multer.File) {
        return this.fileService.uploadFile(groupId, lessonId, file, originalname)
    }
}
