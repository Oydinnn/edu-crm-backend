// import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { PrismaService } from "src/core/database/prisma.service";
// import * as bcrypt from "bcrypt"
// import { Role } from "@prisma/client";

// @Injectable()
// export default class UserSeeder implements OnModuleInit{
//   constructor(
//     private prisma: PrismaService,
//     private jwtService: JwtService,
//   ){}

//   async onModuleInit() {
//     const existSuperAdmin = await this.prisma.user.findUnique({
//       where:{
//         phone: "+998991234567"
//       }
//     })

//     if(existSuperAdmin){
//       Logger.log("✅ SUPERADMIN already exists")
//       return
//     }
//     await this.prisma.user.create({
//       data:{
//         first_name: "Superr",
//         last_name: "Adminn",
//         phone:"+998991234567",
//         password: await bcrypt.hash("991234567", 10) ,
//         email: "oydin6661@gmail.com",
//         address: "Toshkent, Uzbekiston",
//         role: Role.SUPERADMIN
//       }
//     })
//     Logger.log("✅ super admin created")
//   }
// }



import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import * as bcrypt from "bcrypt";
import { Role } from "@prisma/client";

@Injectable()
export default class UserSeeder implements OnModuleInit {  // ← implements qo'shildi
  constructor(private prisma: PrismaService) {}

   async onModuleInit() {  // ← bu method qo'shildi
    await this.seedSuperAdmin();
  }

  async seedSuperAdmin() {
    const superAdminPhone = "+998901234567"; // Environment variable dan olish yaxshi
    
    const existSuperAdmin = await this.prisma.user.findUnique({
      where: { phone: superAdminPhone }
    });

    if (existSuperAdmin) {
      Logger.log("✅ SUPERADMIN already exists");
      return;
    }

    await this.prisma.user.create({
      data: {
        first_name: "Super",
        last_name: "Admin",
        phone: superAdminPhone,
        password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "901234567", 10),
        email: process.env.SEED_ADMIN_EMAIL || "oydin6669@gmail.com",
        address: "Toshkent",
        role: Role.SUPERADMIN,
        status: "active"
      }
    });
    
    Logger.log("✅ SUPERADMIN created successfully");
  }
}