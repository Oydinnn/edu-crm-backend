import axios from 'axios';
export declare class EskizService {
    private token;
    login(): Promise<string>;
    sendSms(phone: string, message: string): Promise<axios.AxiosResponse<any, any, {}>>;
}
