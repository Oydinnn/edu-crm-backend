import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EskizService } from 'src/common/services/sms';
import { RedisService } from 'src/common/redis/redis.service';
import { JwtGenerateToken } from 'src/common/utills/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EskizService, RedisService, JwtGenerateToken]
})
export class AuthModule {}
