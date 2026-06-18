import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { CreateGroupDto } from "./dto/create.dto";
import { AuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/role";
import { GroupStatus, Role } from "@prisma/client";
import { ApiBearerAuth, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { filterDto } from "./dto/search";
import { UpdateGroupDto } from "./dto/update.dto";
import { CreateLessonDto } from "../lessons/dto/create.lesson.dto";

@ApiBearerAuth()
@Controller("groups")
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}


  @ApiOperation({
    summary:`${Role.STUDENT}`
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Get(":groupId/lessonss")
  getLessonsByGroupId(
    @Param("groupId", ParseIntPipe) groupId: number,
    @Req() req: Request
  ){
    return this.groupService.getLessonsByGroupId(groupId, req['user'].id)
  }





  @ApiOperation({
    summary: `${Role.STUDENT}`,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Get(":groupId/lessonId/all")
  getLessons(
    @Param("groupId", ParseIntPipe) groupId: number,
    @Req() req: Request
  ){
    return this.groupService.getLessons(groupId, req['user'].id)
  }




  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get("one/students/:groupId")
  getGroupOne(@Param("groupId", ParseIntPipe) groupId: number) {
    return this.groupService.getGroupOne(groupId);
  }



  

  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get("all")
  getAllGroups(@Query() search: filterDto) {
    return this.groupService.getAllGroups(search);
  }


   @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
  @Get(":groupId")
  getGroupById(
    @Param("groupId", ParseIntPipe) groupId: number,  
  ){
    return this.groupService.getGroupById(groupId)
  }




  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post()
  createGroup(@Body() payload: CreateGroupDto) {
    return this.groupService.createGroup(payload);
  }

  // / ── UPDATE ──────────────────────────────────────────────
  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Patch(":id")
  updateGroup(
    @Param("id", ParseIntPipe) id: number,
    @Body() payload: UpdateGroupDto,
  ) {
    return this.groupService.updateGroup(id, payload);
  }

  // groups.controller.ts
  
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Patch(":id/status")
  toggleStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: GroupStatus,
  ) {
    return this.groupService.toggleStatus(id, status);
  }

  // ── DELETE ──────────────────────────────────────────────
  
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete(":id")
  deleteGroup(@Param("id", ParseIntPipe) id: number) {
    return this.groupService.deleteGroup(id);
  }



   @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
  @Get(":groupId/schedules")
  getschedules(
    @Param("groupId", ParseIntPipe) groupId: number,
    @Req() req: Request
  ){
    return this.groupService.getSchedules(groupId, req['user'].id, req['user'].role)
  }


   @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
  @Post(":groupId/lessons")
  createLesson(
    @Param("groupId", ParseIntPipe) groupId: number,  
    @Body() payload: CreateLessonDto,
    @Query("date") date: string
  ){
    return this.groupService.createLesson(groupId, payload, date)
  }


  @ApiOperation({
    summary: ` getLessonByDate ${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`,
  })
  @ApiQuery({ name: "date", required: true, type: String, description: "YYYY-MM-DD format" })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
  @Get(":groupId/lessons")
  getLessonByDate(
    @Param("groupId", ParseIntPipe) groupId: number,  
    @Query("date") date: string
  ){
    return this.groupService.getLessonByDate(groupId, date)   
  }




}
