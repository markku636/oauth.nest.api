import { LoginDto } from '@/models/oauth/login.dto';
import { VerifyCodeDto } from '@/models/oauth/validate.dto';
import { generalValidateDto } from '@/utils/validation.helper';

import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Render,
    Res,
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
            title: 'OAuth 登入',
            subtitle: '是否允許Cool 3C登入',
            redirectUri: redirectUri || 'default_redirect_uri', // 如果沒提供，使用預設值
        };
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        let validateResult = await generalValidateDto<LoginDto>(
            LoginDto,
            loginDto,
        );

        if (!validateResult.isSuccess) {
            return res.status(200).json(validateResult);
        }

        const result = await this.oauthService.createAuthorizationCode(
            loginDto,
        );

        return res.status(200).json(result);
    }

    // 處理授權碼交換存取令牌
    @Post('validate')
    async Validate(@Body() verifyCodeDto: VerifyCodeDto, @Res() res: Response) {
        let validateResult = await generalValidateDto<VerifyCodeDto>(
            VerifyCodeDto,
            verifyCodeDto,
        );

        if (!validateResult.isSuccess) {
            return res.status(200).json(validateResult);
        }

        const result = await this.oauthService.validateCode(verifyCodeDto);

        return res.status(200).json(result);
    }

    // todo 處理刷新令牌的邏輯 (暫時不做)
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
        return await JSON.stringify(query);
    }
}
