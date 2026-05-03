import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/core/database/prisma.service";
import * as bcrypt from "bcrypt"
import { Role } from "@prisma/client";

@Injectable()
export default class UserSeeder implements OnModuleInit{
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ){}

  async onModuleInit() {
    const existSuperAdmin = await this.prisma.user.findUnique({
      where:{
        phone: "+998975661099"
      }
    })

    if(existSuperAdmin){
      Logger.log("✅ SUPERADMIN already exists")
      return
    }
    await this.prisma.user.create({
      data:{
        first_name: "Superr",
        last_name: "Adminn",
        phone:"+998975661099",
        password: await bcrypt.hash("Benazir99!", 10) ,
        email: "abdukhoshim99@gmail.com",
        address: "Toshkent, Uzbekiston",
        role: Role.SUPERADMIN
      }
    })
    Logger.log("✅ super admin created")
  }
}