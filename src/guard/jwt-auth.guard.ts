import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            // 使用 JwtService 驗證和解析 token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET, // 從環境變數中獲取密鑰
            });

            // 將解析的 payload 賦值給 request 物件，供後續的控制器使用
            request.user = payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        return true;
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
