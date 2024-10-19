import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { encryptPassword } from '../utils/encrypt'; // todo alias path is not working

dotenv.config(); // 這行會載入.env文件

describe('OAuthService', () => {
    it('should hash the password correctly', async () => {
        // 模擬 bcrypt.hash 函數，返回一個已知的哈希值
        const bcryptHashSpy = jest
            .spyOn(bcrypt, 'hash')
            .mockResolvedValue('hashedPassword');

        const password = 'testPassword';
        const expectedHash =
            '$2b$10$ibQugUYqT.1RvqOZA3AqxudHDbMUh8ydc2Sy7N.LcVNHdqhvESl7i';

        // 隨機產生 salt bcrypt.genSaltSync(saltRounds);
        const salt = process.env.SALT;
        const hash = await encryptPassword(password, salt);
        console.log(hash); // 這裡會打印出加密後的哈希值 // '$2b$10$ibQugUYqT.1RvqOZA3AqxudHDbMUh8ydc2Sy7N.LcVNHdqhvESl7i'

        // 驗證 bcrypt.hash 是否被正確調用，並傳入了正確的參數
        expect(hash).toBe(expectedHash);
        // 清除模擬
        bcryptHashSpy.mockRestore();
    });
});
