import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create.dto';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateRoomDto } from './dto/UpdateRoomDto';

@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomService : RoomsService){}

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get()
    getAllRooms(){
        return this.roomService.getAllRooms()
    }




    
    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Post()
    createRoom(@Body() payload: CreateRoomDto){
        return this.roomService.createRoom(payload)
    }



    @ApiOperation({
    summary: `Update room | ${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Patch(':id')
    updateRoom(@Param('id') id: string, @Body() payload: UpdateRoomDto) {
        return this.roomService.updateRoom(id, payload)
    }



    @ApiOperation({
        summary: `Delete room | ${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete(':id')
    deleteRoom(@Param('id') id: string) {
        return this.roomService.deleteRoom(id)
    }
}
