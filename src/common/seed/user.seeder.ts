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
        phone: "+998991234567"
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
        phone:"+998991119999",
        password: await bcrypt.hash("991119999", 10) ,
        email: "oydin6661@gmail.com",
        address: "Toshkent, Uzbekiston",
        role: Role.SUPERADMIN
      }
    })
    Logger.log("✅ super admin created")
  }
}