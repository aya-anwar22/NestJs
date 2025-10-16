import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { AppModule } from '../dist/app.module'; // ✅ لو انت بتستدعي من dist

const server = express();
let cachedServer: any;

export default async function handler(req, res) {
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
