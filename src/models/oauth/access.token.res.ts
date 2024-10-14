export class AccessTokenRes {
    id: number; // 每個 token 的唯一識別符
    accessToken: string; // JWT 存取令牌
    refreshToken: string; // 用於刷新存取令牌的刷新令牌
    expiresAt: Date; // 存取令牌的到期時間
    expiresIn: number; // 存取令牌的有效期
    userId: number; // 令牌所屬的使用者 ID
}
