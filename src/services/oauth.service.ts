import { ApiReturnCode } from '@/enums/api-return-code';
import { AccessTokenRes } from '@/models/oauth/access.token.res';
import { LoginDto } from '@/models/oauth/login.dto';
import { LoginRes } from '@/models/oauth/login.res';
import { VerifyCodeDto } from '@/models/oauth/validate.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addHours, addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from './prisma.service';

@Injectable()
export class OAuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    // 創建授權碼
    async createAuthorizationCode(
        loginDto: LoginDto,
    ): Promise<IApiResultWithData<LoginRes>> {
        const result: IApiResultWithData<LoginRes> = {
            isSuccess: false,
            returnCode: ApiReturnCode.GeneralError,
            data: undefined,
        };

        try {
            // 驗證 email 和 password
            const code = uuidv4();
            const expiresAt = addMinutes(new Date(), 10); // 設定授權碼 10 分鐘內有效

            const user = await this.prisma.user.findFirst({
                where: {
                    email: loginDto.email,
                    password: loginDto.password, // todo 密碼要經過哈希及加嚴處理，
                },
            });

            // todo  可以加一個client id 證明對方是什麼應用程式

            if (!user) {
                result.returnCode = ApiReturnCode.UserNotExist;
                result.validation = {
                    email: 'User or Password is incorrect',
                };
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

            let loginRes = new LoginRes();
            loginRes.id = oauthCode.id;
            loginRes.code = oauthCode.code;
            loginRes.expiresAt = oauthCode.expiresAt;
            loginRes.userId = oauthCode.userId;

            result.data = loginRes;
            result.returnCode = ApiReturnCode.Success;
            result.isSuccess = true;
        } catch (e) {
            // todo write log
        }

        return result;
    }

    // 驗證授權碼
    async validateAuthorizationCode(
        code: string,
    ): Promise<IApiResultWithData<any>> {
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
    async createJWTToken(
        userId: number,
    ): Promise<IApiResultWithData<AccessTokenRes>> {
        const result: IApiResultWithData<AccessTokenRes> = {
            isSuccess: false,
            returnCode: ApiReturnCode.GeneralError,
            data: undefined,
        };

        try {
            // 使用 JWT 生成 accessToken 和 refreshToken
            const accessToken = this.jwtService.sign(
                { userId },
                { expiresIn: '12h' },
            );
            const refreshToken = this.jwtService.sign(
                { userId },
                { expiresIn: '7d' },
            ); // 假設 refreshToken 有效期為 7 天
            const expiresAt = addHours(new Date(), 12); // 存取令牌有效期 1 小時

            // 將生成的 accessToken 和 refreshToken 儲存到資料庫
            const oauthToken = await this.prisma.oAuthToken.create({
                data: {
                    accessToken,
                    refreshToken,
                    expiresAt,
                    userId,
                },
            });

            const validateRes = new AccessTokenRes();
            validateRes.id = oauthToken.id;
            validateRes.accessToken = oauthToken.accessToken;
            validateRes.refreshToken = oauthToken.refreshToken;
            validateRes.expiresAt = oauthToken.expiresAt;
            validateRes.userId = oauthToken.userId;

            result.data = validateRes;
            result.returnCode = ApiReturnCode.Success;
            result.isSuccess = true;
        } catch (e) {
            // todo write log
        }

        return result;
    }

    async validateClientId(clientId: string): Promise<boolean> {
        let validClientIds: string[] = ['ABC123456', 'XYZ987654']; // 可以從資料庫或其他地方取得

        // 檢查 clientId 是否在清單中
        return await validClientIds.includes(clientId);
    }

    async validateCode(
        verifyCodeDto: VerifyCodeDto,
    ): Promise<IApiResultWithData<AccessTokenRes>> {
        const result: IApiResultWithData<AccessTokenRes> = {
            isSuccess: false,
            returnCode: ApiReturnCode.GeneralError,
            data: undefined,
        };

        try {
            // 驗證授權碼
            const validationResult = await this.validateAuthorizationCode(
                verifyCodeDto.code,
            );

            if (!(await this.validateClientId(verifyCodeDto.clientId))) {
                result.returnCode = ApiReturnCode.ClientIdInvalid;
                return result;
            }

            if (!validationResult.isSuccess) {
                return validationResult;
            }

            const oauthCode = validationResult.data;

            // 生成存取令牌
            const tokenResult = await this.createJWTToken(oauthCode.userId);
            if (!tokenResult.isSuccess) {
            }

            // 刪除已使用的授權碼 ( no need to wait for the result )
            // const deleteResult = await this.deleteAuthorizationCode(
            //     verifyCodeDto.code,
            // );

            result.data = tokenResult.data;
            result.returnCode = ApiReturnCode.Success;
            result.isSuccess = true;
        } catch (error) {
            // 可根據需求記錄錯誤日誌
        }

        return result;
    }

    // 刪除授權碼（例如成功交換存取令牌後）
    async deleteAuthorizationCode(
        code: string,
    ): Promise<IApiResultWithData<any>> {
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

    //  根據刷新令牌生成新的存取令牌 (暫時不做)
    // async refreshAccessToken(
    //     refreshToken: string,
    // ): Promise<IApiResultWithData<AccessTokenRes>> {
    //     const result: IApiResultWithData<AccessTokenRes> = {
    //         isSuccess: false,
    //         returnCode: ApiReturnCode.GeneralError,
    //         data: undefined,
    //     };

    //     try {
    //         // 驗證 refreshToken 是否有效
    //         const decoded = this.jwtService.verify(refreshToken);
    //         const oauthToken = await this.prisma.oAuthToken.findUnique({
    //             where: { refreshToken },
    //         });

    //         // 如果 refreshToken 在資料庫中不存在
    //         if (!oauthToken || oauthToken.userId !== decoded.userId) {
    //             result.returnCode = ApiReturnCode.RefreshTokenInvalid;
    //         } else {
    //             // 使用 JWT 生成新的 accessToken
    //             const newAccessToken = this.jwtService.sign(
    //                 { userId: decoded.userId },
    //                 { expiresIn: '12h' },
    //             );
    //             const newExpiresAt = addHours(new Date(), 12); // 設定新的有效期

    //             // 更新資料庫中的 accessToken 和 expiresAt
    //             const updatedToken = await this.prisma.oAuthToken.update({
    //                 where: { id: oauthToken.id },
    //                 data: {
    //                     accessToken: newAccessToken,
    //                     expiresAt: newExpiresAt,
    //                 },
    //             });

    //             let accessTokenRes = new AccessTokenRes();
    //             accessTokenRes.id = updatedToken.id;
    //             accessTokenRes.accessToken = updatedToken.accessToken;
    //             accessTokenRes.refreshToken = updatedToken.refreshToken;
    //             accessTokenRes.expiresAt = updatedToken.expiresAt;
    //             accessTokenRes.userId = updatedToken.userId;

    //             result.data = accessTokenRes;
    //             result.returnCode = ApiReturnCode.Success;
    //             result.isSuccess = true;
    //         }
    //     } catch (e) {
    //         // 如果 refreshToken 無效或過期，拋出錯誤
    //         result.returnCode = ApiReturnCode.RefreshTokenInvalid;
    //         // todo write log
    //     }

    //     return result;
    // }
}
