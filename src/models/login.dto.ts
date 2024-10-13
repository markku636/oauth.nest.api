// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'Email should not be empty' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password: string;

    redirectUri: string;
}
