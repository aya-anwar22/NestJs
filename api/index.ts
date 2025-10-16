import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { AppModule } from '../dist/app.module';
import { Request, Response } from 'express';

const server = express();
let cachedServer: express.Express | null = null;

export default async function handler(req: Request, res: Response): Promise<void> {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.enableCors({
      origin: '*',
    });

    await app.init();
    cachedServer = server;
  }

  return cachedServer(req, res);
}
