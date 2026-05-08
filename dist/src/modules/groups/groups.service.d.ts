import { PrismaService } from 'src/core/database/prisma.service';
import { CreateGroupDto } from './dto/create.dto';
import { filterDto } from './dto/search';
export declare class GroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    getGroupOne(groupId: number): Promise<{
        success: boolean;
        data: {
            first_name: string;
            last_name: string;
            phone: string;
            email: string;
            id: number;
            photo: string | null;
            created_at: Date;
            birth_date: Date;
        }[];
    }>;
    getAllGroups(search: filterDto): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            start_date: Date;
            week_day: string[];
            start_time: string;
            max_student: number;
            courses: {
                id: number;
                name: string;
            };
            rooms: {
                id: number;
                name: string;
            };
            groupTeachers: {
                teacher: {
                    full_name: string;
                };
            }[];
        }[];
    }>;
    createGroup(payload: CreateGroupDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            status: import("@prisma/client").$Enums.GroupStatus;
            created_at: Date;
            update_at: Date;
            name: string;
            description: string | null;
            course_id: number;
            room_id: number;
            start_date: Date;
            week_day: string[];
            start_time: string;
            max_student: number;
        };
    }>;
}
