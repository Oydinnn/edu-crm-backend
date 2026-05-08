"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const client_1 = require("@prisma/client");
let RoomsService = class RoomsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllRooms() {
        const rooms = await this.prisma.room.findMany({
            where: { status: client_1.Status.active },
            select: {
                id: true,
                name: true,
                capacity: true
            }
        });
        return {
            success: true,
            data: rooms
        };
    }
    async createRoom(payload) {
        const existRoom = await this.prisma.room.findUnique({
            where: { name: payload.name }
        });
        if (existRoom) {
            throw new common_1.ConflictException("Room already exists");
        }
        await this.prisma.room.create({
            data: payload
        });
        return {
            success: true,
            message: "Room created"
        };
    }
    async updateRoom(id, payload) {
        const existRoom = await this.prisma.room.findUnique({
            where: { id: Number(id) }
        });
        if (!existRoom) {
            throw new common_1.NotFoundException("Room topilmadi");
        }
        if (payload.name && payload.name !== existRoom.name) {
            const duplicate = await this.prisma.room.findFirst({
                where: { name: payload.name, id: { not: Number(id) } }
            });
            if (duplicate) {
                throw new common_1.ConflictException("Room already exists");
            }
        }
        await this.prisma.room.update({
            where: { id: Number(id) },
            data: {
                name: payload?.name,
                capacity: payload?.capacity
            }
        });
        return { success: true, message: "Room updated" };
    }
    async deleteRoom(id) {
        const existRoom = await this.prisma.room.findUnique({
            where: { id: Number(id) }
        });
        if (!existRoom) {
            throw new common_1.NotFoundException("Room topilmadi");
        }
        await this.prisma.room.delete({
            where: { id: Number(id) }
        });
        return { success: true, message: "Room deleted" };
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map