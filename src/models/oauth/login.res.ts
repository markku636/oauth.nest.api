export class LoginRes {
    id: number; // 每個授權碼的唯一識別符
    code: string; // 授權碼
    expiresAt: Date; // 授權碼的到期時間
    userId: number; // 授權碼所屬的使用者 ID
}
