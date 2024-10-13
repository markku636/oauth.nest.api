import { ApiReturnCode } from '@/enums/api-return-code';
import { LoginDto } from '@/models/login.dto';
import { formatValidationErrors } from '@/utils/validation.helper';

import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Render,
    Res,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
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
    async login(
        @Body() loginDto: LoginDto,
        @Res() res: Response,
    ): Promise<any> {
        // Helper function to format validation errors

        const newDTO = plainToClass(LoginDto, loginDto);

        const errors = await validate(newDTO);

        // If there are validation errors, return them
        if (errors.length > 0) {
            let result: IApiResult = {
                isSuccess: false,
                returnCode: ApiReturnCode.ValidationError,
                validation: formatValidationErrors(errors),
            };

            return res.status(200).json(result);
        }

        // Simulate a result from your OAuth service
        const result = await this.oauthService.createAuthorizationCode(newDTO);

        // Redirect on success
        if (result.isSuccess) {
            // const originalWebsiteUrl = loginDto.redirectUri + '?code=123456';
            return res.status(200).json(result);
        }

        // Return a failure response
        // return res.status(400).json(result);
        return res.json({ isSuccess: true });
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
