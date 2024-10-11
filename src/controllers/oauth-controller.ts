import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
} from '@nestjs/common';
import { OAuthService } from 'src/services/oauth.service';

@Controller('oauth')
export class OAuthController {
    constructor(private readonly oauthService: OAuthService) {}

    // 處理生成授權碼的邏輯

    @Get('test')
    async getHello(@Query() query): Promise<string> {
        // 非同步返回結果
        return Promise.resolve(JSON.stringify(query));
    }

    // 處理生成授權碼的邏輯
    @Post('authorize')
    async authorize(@Body() body: { userId: number }) {
        const { userId } = body;
        const oauthCode = await this.oauthService.createAuthorizationCode(
            userId,
        );
        return { code: oauthCode.code };
    }

    // 處理授權碼交換存取令牌
    @Post('token')
    async token(
        @Body() body: { code: string; clientId: string; clientSecret: string },
    ) {
        const { code, clientId, clientSecret } = body;

        // 檢查授權碼是否合法
        const oauthCode = await this.oauthService.validateAuthorizationCode(
            code,
        );
        if (!oauthCode) {
            throw new HttpException(
                'Invalid authorization code',
                HttpStatus.UNAUTHORIZED,
            );
        }

        // 這裡可以加入更多檢查邏輯來驗證 clientId 和 clientSecret

        // 生成存取令牌
        const token = await this.oauthService.createAccessToken(
            oauthCode.userId,
        );

        // 刪除已使用的授權碼
        await this.oauthService.deleteAuthorizationCode(code);

        return {
            access_token: token.accessToken,
            refresh_token: token.refreshToken,
            expires_in: 3600, // 1 小時有效
        };
    }

    // 處理刷新令牌的邏輯
    @Post('refresh')
    async refreshToken(@Body() body: { refreshToken: string }) {
        const { refreshToken } = body;

        const newToken = await this.oauthService.refreshAccessToken(
            refreshToken,
        );
        if (!newToken) {
            throw new HttpException(
                'Invalid refresh token',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return {
            access_token: newToken.accessToken,
            expires_in: 3600, // 1 小時有效
        };
    }
}
