import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create.dto';
import { UpdateRoomDto } from './dto/UpdateRoomDto';
export declare class RoomsController {
    private readonly roomService;
    constructor(roomService: RoomsService);
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
