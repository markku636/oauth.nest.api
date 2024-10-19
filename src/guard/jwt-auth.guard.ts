import { ApiReturnCode } from '@/enums/api-return-code';
import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            this.failResponse(response, 'Token not found');
            return false; // 確保返回 false 來阻止路由處理器繼續執行
        }

        try {
            // 使用 JwtService 驗證和解析 token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET, // 從環境變數中獲取密鑰
            });

            // 將解析的 payload 賦值給 request 物件，供後續的控制器使用
            request.user = payload;
            return true;
        } catch (error) {
            this.failResponse(response, 'Invalid or expired token');
            return false;
        }
    }

    private failResponse(response: Response, message: string) {
        response.status(HttpStatus.UNAUTHORIZED).json({
            isSuccess: false,
            returnCode: ApiReturnCode.Unauthorized,
            message: message,
            data: null,
        });
    }

    private extractTokenFromHeader(request: Request): string | null {
        const authorizationHeader = request.headers['authorization'];
        if (!authorizationHeader) {
            return null;
        }

        // 提取 Bearer token
        const [bearer, token] = authorizationHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            return null;
        }
        return token;
    }
}

declare module 'express' {
    interface Request {
        user?: any; // 可以根據實際 payload 來定義更具體的類型
    }
}
