import { OnModuleInit } from "@nestjs/common";
export declare class RedisService implements OnModuleInit {
    private clint;
    onModuleInit(): void;
    set(key: string, value: number): Promise<void>;
    get(key: string): Promise<any>;
    del(key: string): Promise<void>;
}
