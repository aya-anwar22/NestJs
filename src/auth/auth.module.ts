import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth, AuthSchema } from './auth.schema';
import { User, UserSchema } from 'src/user/user.schema';

import { JwtUtil } from './utils/jwt.util';
import { HashUtil } from './utils/hash.util';
import { MailerUtil } from './utils/mailer.util';

import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashUtil,
    JwtStrategy,
    RolesGuard,
    {
      provide: JwtUtil,
      useFactory: (config: ConfigService) => new JwtUtil(config),
      inject: [ConfigService],
    },
    {
      provide: MailerUtil,
      useFactory: (config: ConfigService) => new MailerUtil(config),
      inject: [ConfigService],
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
