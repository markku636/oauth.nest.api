import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './controllers/app.controller';
import { OAuthController } from './controllers/oauth.controller';
import { AppService } from './services/app.service';

import { OAuthService } from './services/oauth.service';
import { PrismaService } from './services/prisma.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }), // 加載 .env 文件，並設置為全局可用
        JwtModule.register({
            secret: process.env.JWT_SECRET, // 你的秘密金鑰
            signOptions: { expiresIn: '12h' }, // token 有效時間
        }),
    ], // 匯入其他模組
    controllers: [AppController, OAuthController], // 註冊控制器
    providers: [AppService, PrismaService, OAuthService], // 註冊服務
})
export class AppModule {}
