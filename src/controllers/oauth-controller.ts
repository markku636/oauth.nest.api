import { LoginDto } from '@/models/login.dto';
import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Render,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { OAuthService } from 'src/services/oauth.service';

@Controller('oauth')
export class OAuthController {
    constructor(private readonly oauthService: OAuthService) {}

    @Get('login')
    @Render('oauth/index') // 渲染名為 'oauth/index' 的模板
    OAuthPage(@Query('redirect_uri') redirectUri: string): object {
        // 檢查是否有 redirectUri，並將其傳遞到模板
        return {
            title: 'Jkopay 登入',
            subtitle: '是否允許Cool 3C登入',
            redirectUri: redirectUri || 'default_redirect_uri', // 如果沒提供，使用預設值
        };
    }

    @Post('login')
    @UsePipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    )
    async login(
        @Body() loginDto: LoginDto,
        @Res() res: Response,
    ): Promise<any> {
        const { email, password } = loginDto;

        // Add your authentication logic here
        // For example, you can validate the credentials and generate a token

        const result = await this.oauthService.createAuthorizationCode(
            email,
            password,
        );

        // After successful login, redirect the user to the original website
        const originalWebsiteUrl = loginDto.redirectUri + '?code=123456';
        return res.redirect(originalWebsiteUrl);
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

    // 測試用路徑
    @Get('test')
    async getHello(@Query() query): Promise<string> {
        // 非同步返回結果
        return Promise.resolve(JSON.stringify(query));
    }
}
