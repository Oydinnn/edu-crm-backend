import { FilesService } from './files.service';
export declare class FilesController {
    private readonly fileService;
    constructor(fileService: FilesService);
    getFiles(groupId: number): Promise<{
        success: boolean;
        data: {
            lesson: {
                id: number;
                created_at: Date;
                topic: string;
            };
            id: number;
            created_at: Date;
            originalname: string;
            video_url: string;
            size_mb: number;
        }[];
    }>;
    uploadFile(lessonId: number, groupId: number, originalname: string, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
}
