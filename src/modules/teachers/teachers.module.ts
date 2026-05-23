// import { Module } from '@nestjs/common';
// import { TeachersController } from './teachers.controller';
// import { TeachersService } from './teachers.service';

// @Module({
//   controllers: [TeachersController],
//   providers: [TeachersService]
// })
// export class TeachersModule {}


import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { EmailService } from 'src/common/email/email.service';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService, EmailService], // ✅ EmailService qo'shildi
})
export class TeachersModule {}