// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     abortOnError: false,
//   });

//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true, 
//     forbidNonWhitelisted: true, 
//     transform: true,
//   }));

//     app.useGlobalFilters(new AllExceptionsFilter());
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();



import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { AppModule } from './app.module';
import { Express, Request, Response } from 'express';

const server: Express = express();

let cachedServer: Express | null = null;

// ✅ Vercel handler
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
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: false,
    });

    await app.init();
    cachedServer = server;
  }
  return cachedServer(req, res);
}

// ✅ Local bootstrap
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  await app.listen(3000);
  console.log('🚀 Local server running on http://localhost:3000');
}

// ✅ شغّله محلي لو مش في production
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

