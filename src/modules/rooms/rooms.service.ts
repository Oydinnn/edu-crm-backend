import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateRoomDto } from './dto/create.dto';
import { Status } from '@prisma/client';
import { UpdateRoomDto } from './dto/UpdateRoomDto';

@Injectable()
export class RoomsService {
    constructor(private prisma : PrismaService){}

    async getAllRooms(){
        const rooms = await this.prisma.room.findMany({
            where:{status:Status.active},
            select:{
                id:true,
                name: true,
                capacity:true
            }
        })
        
        return {
            success : true,
            data:rooms
        }
    }

    async createRoom(payload : CreateRoomDto){

        const existRoom = await this.prisma.room.findUnique({
            where:{name:payload.name}
        })

        if(existRoom) {
            throw new ConflictException("Room already exists")
        }

        

        await this.prisma.room.create({
            data:payload
        })

        return {
            success : true,
            message : "Room created"
        }
    }



    // ✏️ Xona tahrirlash
    async updateRoom(id: string, payload: UpdateRoomDto) {
        const existRoom = await this.prisma.room.findUnique({
            where: { id: Number(id) } // Agar schema da id raqam bo'lsa: Number(id)
        });

        if (!existRoom) {
            throw new NotFoundException("Room topilmadi");
        }

        // Agar nom o'zgartirilayotgan bo'lsa, boshqa xonada takrorlanmasligini tekshiramiz
        if (payload.name && payload.name !== existRoom.name) {
            const duplicate = await this.prisma.room.findFirst({
                where: { name: payload.name, id: { not: Number(id) } }
            });
            if (duplicate) {
                throw new ConflictException("Room already exists");
            }
        }

        await this.prisma.room.update({
            where: { id: Number(id) },
            data: {
                name: payload?.name,
                capacity: payload?.capacity
            }
        })

        return { success: true, message: "Room updated" };
    }

    // 🗑️ Xona o'chirish
    async deleteRoom(id: string) {
        const existRoom = await this.prisma.room.findUnique({
            where: { id: Number(id) } // Agar schema da id raqam bo'lsa: Number(id)
        });

        if (!existRoom) {
            throw new NotFoundException("Room topilmadi");
        }

        // Hard delete (to'liq o'chirish)
        await this.prisma.room.delete({
            where: { id: Number(id) }
        });

        return { success: true, message: "Room deleted" };
    }
}
