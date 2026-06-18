import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
export declare class EmailService {
    private readonly mailerService;
    private readonly configService;
    private readonly logger;
    private readonly loginUrl;
    constructor(mailerService: MailerService, configService: ConfigService);
    sendEmail(email: string, phone: string, password: string, fullName: string): Promise<SentMessageInfo>;
    sendTeacherCredentials(email: string, phone: string, password: string, fullName: string): Promise<SentMessageInfo>;
}
