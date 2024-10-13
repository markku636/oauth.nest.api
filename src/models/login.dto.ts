// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    redirectUri: string;
}
