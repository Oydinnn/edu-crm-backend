import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create.admin.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}`
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN)
    @Get('admin/all')
    getAllAdmins() {
        return this.userService.getAllAdmins()
    }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Post("admin")
    createAdmin(@Body() payload: CreateAdminDto) {
        return this.userService.createAdmin(payload)
    }

    @ApiOperation({
        summary: 'Get current user profile details'
    })
    @UseGuards(AuthGuard)
    @Get('me')
    getMe(@Req() req) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.userService.getMe(userId, role);
    }

    @ApiOperation({
        summary: 'Get counts of groups, courses, students, and teachers'
    })
    @UseGuards(AuthGuard)
    @Get('dashboard-stats')
    getDashboardStats() {
        return this.userService.getDashboardStats();
    }
}

