import { PrismaService } from 'src/core/database/prisma.service';
import { CreateRoomDto } from './dto/create.dto';
import { UpdateRoomDto } from './dto/UpdateRoomDto';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllRooms(): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            capacity: number | null;
        }[];
    }>;
    createRoom(payload: CreateRoomDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateRoom(id: string, payload: UpdateRoomDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteRoom(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
