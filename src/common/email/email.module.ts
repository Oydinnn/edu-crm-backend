// email.module.ts
import { MailerModule } from "@nestjs-modules/mailer";
import { Global, Module } from "@nestjs/common";
import { join } from "path";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from "./email.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
    imports: [
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get('SMTP_HOST'),
                    port: parseInt(configService.get('SMTP_PORT') || '587'),
                    secure: configService.get('SMTP_SECURE') === 'true',
                    auth: {
                        user: configService.get('SMTP_USER'),
                        pass: configService.get('SMTP_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"CRM System" <${configService.get('SMTP_FROM')}>`,
                },
                template: {
                    dir: join(__dirname, '..', 'templates'), // ✅ Template papkasi joylashuvi
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {}















// import { MailerModule } from "@nestjs-modules/mailer";
// import { Global, Module } from "@nestjs/common";
// import { join } from "path";
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { EmailService } from "./email.service";
// import { ConfigModule, ConfigService } from "@nestjs/config";
// @Global()
// @Module({
//     imports:[

//         // MailerModule.forRoot({
//         //     transport:{
//         //         service:"gmail",
//         //         auth:{
//         //             user:"abdukhoshim99@gmail.com",
//         //             pass:"mtvmhepjjhypchmb"
//         //         }
//         //     },
//         //     defaults:{
//         //         from:'"N26" <abdukhoshim99@gmail.com>'
//         //     },
//         //     template:{
//         //         dir:join(process.cwd(),"src","templates"),
//         //         adapter:new HandlebarsAdapter(),
//         //         options:{
//         //             strict:true
//         //         }
//         //     }
//         // })

//         // app.module.ts yoki email.module.ts
//         // MailerModule.forRootAsync({
//         // imports: [ConfigModule],
//         // useFactory: async (configService: ConfigService) => ({
//         //     transport: {
//         //     host: 'smtp.gmail.com',
//         //     port: 465,  // ⚠️ 587 o'rniga 465 portni ishlating
//         //     secure: true, // ⚠️ 465 port uchun true
//         //     auth: {
//         //         user: configService.get('SMTP_USER'),
//         //         pass: configService.get('SMTP_PASSWORD'), // App password
//         //     },
//         //     },
//         //     defaults: {
//         //     from: `"CRM System" <${configService.get('SMTP_USER')}>`,
//         //     },
//         // }),
//         // }),
//     ],
//     providers:[EmailService],
//     exports:[EmailService]
// })
// export class EmailModule{}