// import { MailerService } from "@nestjs-modules/mailer";
// import { Injectable } from "@nestjs/common";


// @Injectable()
// export class EmailService{
//     constructor(private readonly mailerService : MailerService){}

//     async sendEmail(email:string,login:string,password:string){
//         await this.mailerService.sendMail({
//             to:email,
//             from:process.env.EMAIL,
//             subject:"CRM tizmidan foydalanish uchun login/password",
//             template:"index",
//             context:{
//                 text:`login : ${login}<br>password : ${password}`
//             }
//         })
//     }
// }

// email.service.ts
// email.service.ts
// import { MailerService } from "@nestjs-modules/mailer";
// import { Injectable, Logger } from "@nestjs/common";

// @Injectable()
// export class EmailService {
//   private readonly logger = new Logger(EmailService.name);

//   constructor(private readonly mailerService: MailerService) {}

//   async sendTeacherCredentials(email: string, phone: string, password: string, fullName: string) {
//     try {
//       this.logger.log(`📧 Sending email to: ${email}`);
      
//       // ✅ Template bilan yuborish
//       const result = await this.mailerService.sendMail({
//         to: email,
//         subject: "CRM tizimiga kirish uchun login va parol",
//         template: "teacher-credentials", // .hbs fayl nomi (teacher-credentials.hbs)
//         context: {
//           full_name: fullName,
//           login: phone,
//           password: password,
//           login_url: process.env.LOGIN_URL || "http://localhost:3000/login",
//         },
//       });
      
//       this.logger.log('✅ Email sent successfully');
//       this.logger.log(`Message ID: ${result.messageId}`);
//       return result;
//     } catch (error) {
//       this.logger.error('❌ Failed to send email:', error);
//       throw error;
//     }
//   }

//   // Test email uchun
//   async sendTestEmail(email: string) {
//     try {
//       const result = await this.mailerService.sendMail({
//         to: email,
//         subject: "Test Email",
//         text: "This is a test email",
//         html: "<h1>Test</h1><p>Email is working!</p>",
//       });
//       this.logger.log('✅ Test email sent successfully');
//       return result;
//     } catch (error) {
//       this.logger.error('❌ Test email failed:', error);
//       throw error;
//     }
//   }
// }




// src/common/email/email.service.ts
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly loginUrl: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,

    ) {
    // ✅ Konstruktorda URL ni olish
    this.loginUrl = this.configService.get<string>('LOGIN_URL') || 'http://localhost:5173/login';
    this.logger.log(`Login URL configured: ${this.loginUrl}`);
    }

  // ✅ STUDENTLAR UCHUN - sendEmail metodi
  // ✅ sendEmail metodi (4 ta argument)
  async sendEmail(email: string, phone: string, password: string, fullName: string) {
    try {
      this.logger.log(`📧 Sending email to: ${email}`);
      
      const result = await this.mailerService.sendMail({
        to: email,
        subject: "CRM tizimiga kirish uchun login va parol",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
              .header { background: #2196F3; color: white; padding: 10px; text-align: center; border-radius: 5px 5px 0 0; }
              .credentials { background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .label { font-weight: bold; color: #555; }
              .value { font-family: monospace; font-size: 16px; margin-left: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>CRM Tizimiga Xush Kelibsiz!</h2>
              </div>
              <div class="content">
                <p>Hurmatli <strong>${fullName}</strong>,</p>
                <p>Siz CRM tizimida o'quvchi sifatida ro'yxatdan o'tkazildingiz.</p>
                <div class="credentials">
                  <p><span class="label">📱 Login (Telefon):</span> <span class="value">${phone}</span></p>
                  <p><span class="label">🔑 Parol:</span> <span class="value">${password}</span></p>
                </div>
                <p>⚠️ Parolingizni xavfsiz joyda saqlang!</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      
      this.logger.log('✅ Email sent successfully');
      return result;
    } catch (error) {
      this.logger.error('❌ Failed to send email:', error);
      throw error;
    }
  }

  // ✅ TEACHERLAR UCHUN - teacher credentials
  async sendTeacherCredentials(email: string, phone: string, password: string, fullName: string) {
    try {
        // console.log('LOGIN_URL from env:', process.env.LOGIN_URL);
    //   console.log('All env vars:', process.env);

    //   const loginUrl = process.env.LOGIN_URL || "http://localhost:5173/login";
    //   console.log('Final loginUrl:', loginUrl);

      this.logger.log(`📧 Sending email to teacher: ${email}`);

      
      const result = await this.mailerService.sendMail({
        to: email,
        subject: "CRM tizimiga kirish uchun login va parol",
        template: "teacher-credentials",
        context: {
          full_name: fullName,
          login: phone,
          password: password,
          login_url: process.env.LOGIN_URL || "http://localhost:5173/login",
        },
      });
      
      this.logger.log('✅ Teacher email sent successfully');
      return result;
    } catch (error) {
      this.logger.error('❌ Failed to send teacher email:', error);
      throw error;
    }
  }

  // ✅ Test email uchun
//   async sendTestEmail(email: string) {
//     try {
//       const result = await this.mailerService.sendMail({
//         to: email,
//         subject: "Test Email",
//         text: "This is a test email",
//         html: "<h1>Test</h1><p>Email is working!</p>",
//       });
//       this.logger.log('✅ Test email sent successfully');
//       return result;
//     } catch (error) {
//       this.logger.error('❌ Test email failed:', error);
//       throw error;
//     }
//   }
}