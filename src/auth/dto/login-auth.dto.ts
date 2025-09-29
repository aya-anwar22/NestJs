import { IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';


export class LoginAuthDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}


export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'User name' })
  userName: string;
}