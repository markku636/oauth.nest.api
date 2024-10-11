import { Injectable } from '@nestjs/common';
import { addHours, addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from './prisma.service';

@Injectable()
export class OAuthService {
    constructor(private readonly prisma: PrismaService) {}

    // 創建授權碼
    async createAuthorizationCode(userId: number) {
        const code = uuidv4();
        const expiresAt = addMinutes(new Date(), 10); // 設定授權碼 10 分鐘內有效

        const oauthCode = await this.prisma.oAuthCode.create({
            data: {
                code,
                expiresAt,
                userId,
            },
        });

        return oauthCode;
    }

    // 驗證授權碼
    async validateAuthorizationCode(code: string) {
        const oauthCode = await this.prisma.oAuthCode.findUnique({
            where: { code },
        });

        if (!oauthCode || oauthCode.expiresAt < new Date()) {
            return null;
        }

        return oauthCode;
    }

    // 創建存取令牌和刷新令牌
    async createAccessToken(userId: number) {
        const accessToken = uuidv4();
        const refreshToken = uuidv4();
        const expiresAt = addHours(new Date(), 1); // 存取令牌有效期 1 小時

        const oauthToken = await this.prisma.oAuthToken.create({
            data: {
                accessToken,
                refreshToken,
                expiresAt,
                userId,
            },
        });

        return oauthToken;
    }

    // 驗證存取令牌
    async validateAccessToken(token: string) {
        const oauthToken = await this.prisma.oAuthToken.findUnique({
            where: { accessToken: token },
        });

        if (!oauthToken || oauthToken.expiresAt < new Date()) {
            return null;
        }

        return oauthToken;
    }

    // 刪除授權碼（例如成功交換存取令牌後）
    async deleteAuthorizationCode(code: string) {
        await this.prisma.oAuthCode.delete({
            where: { code },
        });
    }

    // 根據刷新令牌生成新的存取令牌
    async refreshAccessToken(refreshToken: string) {
        const oauthToken = await this.prisma.oAuthToken.findUnique({
            where: { refreshToken },
        });

        if (!oauthToken) {
            return null;
        }

        const newAccessToken = uuidv4();
        const newExpiresAt = addHours(new Date(), 1);

        const updatedToken = await this.prisma.oAuthToken.update({
            where: { id: oauthToken.id },
            data: {
                accessToken: newAccessToken,
                expiresAt: newExpiresAt,
            },
        });

        return updatedToken;
    }
}
