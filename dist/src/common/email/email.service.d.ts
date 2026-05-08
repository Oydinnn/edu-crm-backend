import { MailerService } from "@nestjs-modules/mailer";
export declare class EmailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendEmail(email: string, login: string, password: string): Promise<void>;
}
