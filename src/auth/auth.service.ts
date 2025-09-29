import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './auth.schema';
import { User, UserDocument } from 'src/user/user.schema';
import { LoginAuthDto, LoginResponseDto } from './dto/login-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LogoutDto } from './dto/logout.dto';
import { HashUtil } from './utils/hash.util';
import { JwtUtil } from './utils/jwt.util';
import { MailerUtil } from './utils/mailer.util';
import { generateRandomCode } from './utils/crypto.util';
import { VerifyEmailDto } from './dto/virify-email.dto';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtUtil: JwtUtil,
    private mailer: MailerUtil,
  ) {}

async signUp(dto: SignUpDto) {
  const exist = await this.userModel.findOne({ email: dto.email });

  if (exist) {
    if (exist.isVerified) {
      throw new BadRequestException('Email already exists');
    } else {
      const code = generateRandomCode(6);

      await this.authModel.findOneAndUpdate(
        { userId: exist._id },
        {
          emailVerificationCode: code,
          verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
        },
        { new: true, upsert: true }
      );

      const verifyUrl = 'http://localhost:4200'; 
      const htmlBody = this.mailer['buildVerificationEmail'](
        exist.userName,
        code,
        verifyUrl,
      );

      await this.mailer.sendEmail(
        exist.email,
        'Verify your account',
        htmlBody,
      );

      return {
        message:
          'User already registered but not verified. A new verification code has been sent to your email.',
      };
    }
  }

  const hashed = await HashUtil.hashPassword(dto.password);
  const user = await this.userModel.create({ ...dto, password: hashed });

  const code = generateRandomCode(6);

  await this.authModel.create({
    userId: user._id,
    emailVerificationCode: code,
    verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
  });

  const verifyUrl = 'http://localhost:4200';
  const htmlBody = this.mailer['buildVerificationEmail'](
    user.userName,
    code,
    verifyUrl,
  );

  await this.mailer.sendEmail(
    user.email,
    'Verify your account',
    htmlBody,
  );

  return {
    message:
      'User registered successfully. Please check your email for verification code.',
  };
}

async verifyEmail(dto: VerifyEmailDto) {
  const user = await this.userModel.findOne({ email: dto.email });
  if (!user) {
    throw new BadRequestException('User not found');
  }

  if (user.isVerified) {
    throw new BadRequestException('Email already verified');
  }

  const auth = await this.authModel.findOne({ userId: user._id });
  if (!auth) {
    throw new BadRequestException('Verification not found');
  }

  if (auth.emailVerificationCode !== dto.code) {
    throw new BadRequestException('Invalid verification code');
  }

  if (auth.verificationCodeExpiry && auth.verificationCodeExpiry < new Date()) {
    throw new BadRequestException('Verification code expired');
  }

  user.isVerified = true;
  await user.save();

  auth.isVerified = true;
  auth.emailVerificationCode = null;
  auth.verificationCodeExpiry = null;
  await auth.save();

  return { message: 'Email verified successfully' };
}

async login(dto: LoginAuthDto): Promise<LoginResponseDto> {
  const user = await this.userModel.findOne({ email: dto.email }).exec();
  if (!user) throw new UnauthorizedException('Invalid email or password');

  const valid = await HashUtil.comparePassword(dto.password, user.password);
  if (!valid) throw new UnauthorizedException('Invalid email or password');

  const payload = { sub: user._id, role: user.role };
  const accessToken = this.jwtUtil.signAccessToken(payload);
  const refreshToken = this.jwtUtil.signRefreshToken(payload);

  await this.authModel.updateOne(
    { userId: user._id },
    { refreshToken, refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  );

  return {
    accessToken,
    refreshToken,
    userName: user.userName,
  };
}


async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new BadRequestException('User not found');

    const code = generateRandomCode(6).slice(0, 6); 
    await this.authModel.updateOne(
      { userId: user._id },
      { resetPasswordCode: code, resetPasswordExpiry: new Date(Date.now() + 15 * 60 * 1000) },
    );

    await this.mailer.sendEmail(user.email, 'Password Reset Code', `Your reset code is: ${code}`);

    return { message: 'Reset code sent to email' };
}

async logout(dto: LogoutDto) {
    const auth = await this.authModel.findOne({ refreshToken: dto.refreshToken });
    if (!auth) throw new BadRequestException('Invalid refresh token');

    auth.refreshToken = null;
    auth.refreshTokenExpiry = null;
    await auth.save();

    return { message: 'Logged out successfully' };
  }



  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new BadRequestException('User not found');

    const auth = await this.authModel.findOne({ userId: user._id });
    if (!auth || auth.resetPasswordCode !== dto.code) {
      throw new BadRequestException('Invalid reset code');
    }

    if (auth.resetPasswordExpiry && auth.resetPasswordExpiry < new Date()) {
      throw new BadRequestException('Reset code expired');
    }

    user.password = await HashUtil.hashPassword(dto.newPassword);
    await user.save();

    auth.resetPasswordCode = null;
    auth.resetPasswordExpiry = null;
    await auth.save();

    return { message: 'Password reset successfully' };
  }
}
