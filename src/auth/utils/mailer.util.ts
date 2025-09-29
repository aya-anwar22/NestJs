import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export class MailerUtil {
  private transporter;
  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.config.get('EMAIL_SERVICE'),
      auth: {
        user: this.config.get('EMAIL_ADMIN'),
        pass: this.config.get('EMAIL_PASS'),
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ) {
    return this.transporter.sendMail({
      from: this.config.get('EMAIL_ADMIN'),
      to,
      subject,
      text: text || 'Please view this email in an HTML-capable client.',
      html,
    });
  }


  private buildVerificationEmail(userName: string, code: string, verifyUrl: string): string {
  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Verify your email</title>
      <style>
        body { margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; background-color:#f5f7fb; }
        .container { max-width:600px; margin:30px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(90deg, #cb6ce6 0%, #a965d9 100%); padding:18px 24px; color:#fff; }
        .brand { font-size:20px; font-weight:700; letter-spacing:0.2px; }
        .content { padding:28px 24px; color:#222; line-height:1.5; }
        .greeting { font-size:16px; margin-bottom:12px; }
        .message { margin-bottom:18px; color:#444; }
        .otp { display:block; font-size:28px; font-weight:700; color:#111; letter-spacing:4px; margin:14px 0; text-align:center; background:#f3eef9; padding:12px 0; border-radius:6px; }
        .btn-wrap { text-align:center; margin:18px 0; }
        .btn { background:#cb6ce6; color:#fff; text-decoration:none; padding:12px 20px; border-radius:8px; display:inline-block; font-weight:600; }
        .small { font-size:13px; color:#777; margin-top:8px; }
        .footer { padding:18px 24px; font-size:12px; color:#888; background:#fafafa; text-align:center; }
        a.text-link { color:#cb6ce6; text-decoration:none; font-weight:600; }
        @media (max-width:420px){
          .container { margin:10px; }
          .otp { font-size:24px; letter-spacing:3px; }
        }
      </style>
    </head>
    <body>
      <div class="container" role="article" aria-label="Verify your Barmajny account">
        <div class="header">
          <div class="brand">Barmajny</div>
        </div>
        <div class="content">
          <div class="greeting">Hi ${userName || 'there'},</div>
          <div class="message">
            Thank you for creating an account on <strong>Barmajny</strong>.<br/>
            To complete your registration, please verify your email address using the code below or by clicking the button.
          </div>
          <div class="otp">${code}</div>
          <div class="btn-wrap">
            <a href="${verifyUrl}" class="btn" target="_blank" rel="noopener">Verify my email</a>
          </div>
          <div class="small">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a class="text-link" href="${verifyUrl}" target="_blank" rel="noopener">${verifyUrl}</a>
          </div>
          <p class="small" style="margin-top:18px;">
            This code will expire in 10 minutes. If you didn't sign up, just ignore this email.
          </p>
        </div>
        <div class="footer">
          Barmajny • Building simple web solutions for small businesses<br/>
          <span style="color:#bbb">Need help? Reply to this email.</span>
        </div>
      </div>
    </body>
  </html>
  `;
}

}


