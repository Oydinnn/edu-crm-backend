// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { PrismaModule } from './core/database/prisma.module';
// import { UsersModule } from './modules/users/users.module';
// import { StudentsModule } from './modules/students/students.module';
// import { TeachersModule } from './modules/teachers/teachers.module';
// import { CoursesModule } from './modules/courses/courses.module';
// import { GroupsModule } from './modules/groups/groups.module';
// import { RoomsModule } from './modules/rooms/rooms.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from "path"
// import { LessonsModule } from './modules/lessons/lessons.module';
// import { AttendanceModule } from './modules/attendance/attendance.module';
// import { HomeworkModule } from './modules/homework/homework.module';
// import { SeederModule } from './common/seed/seeder.module';

// @Module({
//   imports: [
//     ServeStaticModule.forRoot({
//       rootPath: join(process.cwd(),"src" ,"uploads"),
//       serveRoot:"/files"
//     })
//     ,
//     ConfigModule.forRoot({
//       isGlobal: true
//     }),
//     AuthModule,
//     PrismaModule,
//     UsersModule,
//     StudentsModule,
//     TeachersModule,
//     CoursesModule,
//     GroupsModule,
//     RoomsModule,
//     LessonsModule,
//     AttendanceModule,
//     HomeworkModule,
//     SeederModule
//   ],
// })
// export class AppModule { }


import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from "path";
import { ServeStaticModule } from '@nestjs/serve-static';

import { PrismaModule } from './core/database/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { CoursesModule } from './modules/courses/courses.module';
import { GroupsModule } from './modules/groups/groups.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AuthModule } from './modules/auth/auth.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { SeederModule } from './common/seed/seeder.module';
import { EmailModule } from './common/email/email.module';
import { FilesModule } from './modules/files/files.module';
import { RedisModule } from './common/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule.register({
      secret:"shaftoli",
      // signOptions:{
      //   expiresIn:"1h"
      // },
      global:true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "src", "uploads"),
      serveRoot: "/files"
    }),
    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // ✅ MAILER MODULNI QO'SHING
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST') || 'smtp.gmail.com',
          port: parseInt(configService.get('SMTP_PORT') || '587'),
          secure: configService.get('SMTP_SECURE') === 'true' ? true : false,
          auth: {
            user: configService.get('SMTP_USER') || configService.get('EMAIL'),
            pass: configService.get('SMTP_PASSWORD') || configService.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"CRM System" <${configService.get('SMTP_FROM') || configService.get('EMAIL')}>`,
        },
        template: {
          dir: join(process.cwd(), 'src', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    
    // ✅ EMAIL MODULNI QO'SHING
    EmailModule,
    
    AuthModule,
    PrismaModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    CoursesModule,
    GroupsModule,
    RoomsModule,
    LessonsModule,
    AttendanceModule,
    HomeworkModule,
    SeederModule,
    FilesModule,
    RedisModule
  ],
})
export class AppModule { }