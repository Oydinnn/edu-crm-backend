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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    mailerService;
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    loginUrl;
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
        this.loginUrl = this.configService.get('LOGIN_URL') || 'http://localhost:5173/login';
        this.logger.log(`Login URL configured: ${this.loginUrl}`);
    }
    async sendEmail(email, phone, password, fullName) {
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
        }
        catch (error) {
            this.logger.error('❌ Failed to send email:', error);
            throw error;
        }
    }
    async sendTeacherCredentials(email, phone, password, fullName) {
        try {
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
        }
        catch (error) {
            this.logger.error('❌ Failed to send teacher email:', error);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map