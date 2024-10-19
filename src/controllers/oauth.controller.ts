import { JwtAuthGuard } from '@/guard/jwt-auth.guard';
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
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { OAuthService } from 'src/services/oauth.service';

@Controller('oauth')
export class OAuthController {
    constructor(
        private readonly oauthService: OAuthService,
        private readonly jwtService: JwtService,
    ) {}

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

    // JWT 驗證保護的路由
    @Post('get-protected-data')
    @UseGuards(JwtAuthGuard)
    @Get()
    getProtectedData(@Req() req: Request) {
        const user = req.user; // 取得驗證通過後的使用者資料

        return {
            message: 'This is a protected route',
            user: user, // 回傳使用者資料
        };
    }
}
