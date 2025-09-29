import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(6)
    code: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    newPassword: string;
}