import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export class JwtUtil {
  constructor(private config: ConfigService) {}

  signAccessToken(payload: any) {
    return jwt.sign(payload, this.config.get<string>('ACCESS_TOKEN_SECRET')!, {
      expiresIn: '15m',
    });
  }

  signRefreshToken(payload: any) {
    return jwt.sign(payload, this.config.get<string>('REFRESH_TOKEN_SECRET')!, {
      expiresIn: '7d',
    });
  }

  verifyToken(token: string, type: 'access' | 'refresh') {
    const secret =
      type === 'access'
        ? this.config.get<string>('ACCESS_TOKEN_SECRET')!
        : this.config.get<string>('REFRESH_TOKEN_SECRET')!;

    return jwt.verify(token, secret);
  }
}
