// src/auth/dto/login.dto.ts

import { IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {
    @IsNotEmpty({ message: 'Email should not be empty' })
    code: string;

    @IsNotEmpty({ message: 'ClientId should not be empty' })
    clientId: string;
}
