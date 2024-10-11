import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OAuthService } from 'src/services/oauth.service';

@Controller('oauth')
export class OAuthController {
    constructor(private readonly oauthService: OAuthService) {}

    // 測試用路徑
    @Get('test')
    async getHello(@Query() query): Promise<string> {
        // 非同步返回結果
        return Promise.resolve(JSON.stringify(query));
    }

    // 處理生成授權碼的邏輯
    @Post('authorize')
    async authorize(@Body() body: { userId: number }) {
        const { userId } = body;
        const result = await this.oauthService.createAuthorizationCode(userId);

        return result;
    }

    // 處理授權碼交換存取令牌
    @Post('token')
    async token(
        @Body() body: { code: string; clientId: string; clientSecret: string },
    ) {
        const { code, clientId, clientSecret } = body;

        const result = await this.oauthService.authorizationCodeForToken(
            code,
            clientId,
            clientSecret,
        );

        return result;
    }

    // 處理刷新令牌的邏輯
    @Post('refresh')
    async refreshToken(@Body() body: { refreshToken: string }) {
        const { refreshToken } = body;

        const tokenResult = await this.oauthService.refreshAccessToken(
            refreshToken,
        );

        return tokenResult;
    }
}
