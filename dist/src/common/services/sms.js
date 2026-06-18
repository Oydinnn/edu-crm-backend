"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EskizService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let EskizService = class EskizService {
    token;
    async login() {
        try {
            const response = await axios_1.default.post('https://notify.eskiz.uz/api/auth/login', {
                email: process.env.ESKIZ_EMAIL,
                password: process.env.ESKIZ_PASSWORD,
            });
            this.token = response.data.data.token;
            return this.token;
        }
        catch (error) {
            console.log('ERROR:', error.response?.data);
            console.log('STATUS:', error.response?.status);
            console.log('MESSAGE:', error.message);
            throw error;
        }
    }
    async sendSms(phone, message) {
        if (!this.token) {
            await this.login();
        }
        return axios_1.default.post('https://notify.eskiz.uz/api/message/sms/send', {
            mobile_phone: phone,
            message,
            from: '4546',
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
    }
};
exports.EskizService = EskizService;
exports.EskizService = EskizService = __decorate([
    (0, common_1.Injectable)()
], EskizService);
//# sourceMappingURL=sms.js.map