import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class FilesService {
    constructor(private readonly prisma:PrismaService){}

    async getFiles(groupId: number){
        const group = await this.prisma.group.findUnique({
            where:{id:groupId}
        })

        if(!group){
            throw new Error("Guruh topilmadi")
        }

        const videos = await this.prisma.lessonVideo.findMany({
            where:{group_id:groupId},
            select:{
                id:true,
                video_url:true,
                size_mb:true,
                originalname:true,
                created_at:true,  
                lesson:{
                    select:{
                        id:true,
                        topic:true, 
                        created_at:true,
                    }
                }
            }   
        })

        return {
            success:true,
            data:videos
        }
    }

    async uploadFile(groupId: number, lessonId: number, file: Express.Multer.File, originalname?: string) {
        const group = await this.prisma.group.findUnique({
            where:{id:groupId},
        })

        if(!group){
            throw new Error("Guruh topilmadi")
        }

        const lesson = await this.prisma.lesson.findUnique({
            where:{id:lessonId}
        })

        if(!lesson){
            throw new Error("Dars topilmadi")
        }

        await this.prisma.lessonVideo.create({  
            data:{
                lesson_id:lesson.id,
                group_id:group.id,
                video_url:file.filename,
                originalname:originalname || file.originalname,
                size_mb:file.size/1024/1024,
            }
        })
        
        return {
            success:true,
            message:"File uploaded successfully"
        }
    }
}
