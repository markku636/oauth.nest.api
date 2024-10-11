import { ApiReturnCode } from '@/enums/api-return-code';
import { Injectable } from '@nestjs/common';
import { addHours, addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from './prisma.service';

@Injectable()
export class OAuthService {
    constructor(private readonly prisma: PrismaService) {}

    // 創建授權碼
    async createAuthorizationCode(username: string, password: string) {
        const result: IApiResultWithData<any> = {
            isSuccess: false,
            returnCode: ApiReturnCode.GeneralError,
            data: undefined,
        };

        try {
            // 驗證 email 和 password
            const code = uuidv4();
            const expiresAt = addMinutes(new Date(), 10); // 設定授權碼 10 分鐘內有效

            // todo  帳密格式驗證及加嚴

            const user = await this.prisma.user.findFirst({
                where: {
                    username: username,
                    password: password, // 假設密碼沒有經過哈希處理，這不是推薦的做法
                },
            });

            if (!user) {
                return result;
            }

            let userId: number = user.id;

            const oauthCode = await this.prisma.oAuthCode.create({
                data: {
                    code,
                    expiresAt,
                    userId,
                },
            });

            result.data = oauthCode;
            result.returnCode = ApiReturnCode.Success;
            result.isSuccess = true;
        } catch (e) {
            // todo write log
        }

        return result;
    }

    // 驗證授權碼
    async validateAuthorizationCode(code: string) {
        const result: IApiResultWithData<any> = {
            isSuccess: false,
            returnCode: ApiReturnCode.GeneralError,
            data: undefined,
        };

        try {
            const oauthCode = await this.prisma.oAuthCode.findUnique({
                where: { code },
            });

            if (!oauthCode || oauthCode.expiresAt < new Date()) {
                result.returnCode =
                    ApiReturnCode.AuthorizationCodeInvalidOrExpired;
            } else {
                result.data = oauthCode;
                result.returnCode = ApiReturnCode.Success;
                result.isSuccess = true;
            }
        } catch (e) {
            // todo write log
        }

        return result;
    }

    // 創建存取令牌和刷新令牌
    async createAccessToken(userId: number) {
        const result: IApiResultWithData<any> = {
            isSuccess: false,
            returnCode: ApiReturnCode.GeneralError,
            data: undefined,
        };

        try {
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

            result.data = oauthToken;
            result.returnCode = ApiReturnCode.Success;
            result.isSuccess = true;
        } catch (e) {
            // todo write log
        }

        return result;
    }

    async authorizationCodeForToken(
        code: string,
        clientId: string,
        clientSecret: string,
    ) {
        const result: IApiResultWithData<any> = {
            isSuccess: false,
            returnCode: ApiReturnCode.GeneralError,
            data: undefined,
        };

        try {
            // 驗證授權碼
            const validationResult = await this.validateAuthorizationCode(code);
            if (!validationResult.isSuccess) {
                return validationResult;
            }

            const oauthCode = validationResult.data;

            // 可以在這裡加入 clientId 和 clientSecret 的額外驗證邏輯
            // 例如驗證 clientId 和 clientSecret 是否匹配

            // 生成存取令牌
            const tokenResult = await this.createAccessToken(oauthCode.userId);
            if (!tokenResult.isSuccess) {
                throw new Error('Failed to generate access token');
            }

            // 刪除已使用的授權碼
            const deleteResult = await this.deleteAuthorizationCode(code);
            if (!deleteResult.isSuccess) {
                throw new Error('Failed to delete authorization code');
            }

            result.data = {
                access_token: tokenResult.data.accessToken,
                refresh_token: tokenResult.data.refreshToken,
                expires_in: 3600, // 1 小時有效
            };
            result.isSuccess = true;
            result.returnCode = ApiReturnCode.Success;
        } catch (error) {
            // 可根據需求記錄錯誤日誌
            result.isSuccess = false;
            result.returnCode = ApiReturnCode.GeneralError;
        }

        return result;
    }

    // 驗證存取令牌
    async validateAccessToken(token: string) {
        const result: IApiResultWithData<any> = {
            isSuccess: false,
            returnCode: ApiReturnCode.GeneralError,
            data: undefined,
        };

        try {
            const oauthToken = await this.prisma.oAuthToken.findUnique({
                where: { accessToken: token },
            });

            if (!oauthToken || oauthToken.expiresAt < new Date()) {
                result.returnCode = ApiReturnCode.AccessTokenInvalidOrExpired;
            } else {
                result.data = oauthToken;
                result.returnCode = ApiReturnCode.Success;
                result.isSuccess = true;
            }
        } catch (e) {
            // todo write log
        }

        return result;
    }

    // 刪除授權碼（例如成功交換存取令牌後）
    async deleteAuthorizationCode(code: string) {
        const result: IApiResultWithData<any> = {
            isSuccess: false,
            returnCode: ApiReturnCode.GeneralError,
            data: undefined,
        };

        try {
            await this.prisma.oAuthCode.delete({
                where: { code },
            });

            result.returnCode = ApiReturnCode.Success;
            result.isSuccess = true;
        } catch (e) {
            // todo write log
        }

        return result;
    }

    // 根據刷新令牌生成新的存取令牌
    async refreshAccessToken(refreshToken: string) {
        const result: IApiResultWithData<any> = {
            isSuccess: false,
            returnCode: ApiReturnCode.GeneralError,
            data: undefined,
        };

        try {
            const oauthToken = await this.prisma.oAuthToken.findUnique({
                where: { refreshToken },
            });

            if (!oauthToken) {
                result.returnCode = ApiReturnCode.RefreshTokenInvalid;
            } else {
                const newAccessToken = uuidv4();
                const newExpiresAt = addHours(new Date(), 1);

                const updatedToken = await this.prisma.oAuthToken.update({
                    where: { id: oauthToken.id },
                    data: {
                        accessToken: newAccessToken,
                        expiresAt: newExpiresAt,
                    },
                });

                result.data = updatedToken;
                result.returnCode = ApiReturnCode.Success;
                result.isSuccess = true;
            }
        } catch (e) {
            // todo write log
        }

        return result;
    }
}
