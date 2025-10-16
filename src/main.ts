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

const expressServer = express();

// ✅ Global prefix لل routes
const globalPrefix = 'api';

let cachedNestApp: express.Express;

async function bootstrapNest() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressServer)
  );

  // Set global prefix
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });

  await app.init();
  return expressServer;
}

// ✅ Vercel handler
export default async function handler(req: express.Request, res: express.Response) {
  if (!cachedNestApp) {
    console.log('🔄 Initializing NestJS app...');
    cachedNestApp = await bootstrapNest();
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  return cachedNestApp(req, res);
}

// ✅ Local development
if (process.env.NODE_ENV !== 'production') {
  bootstrapNest().then(() => {
    console.log(`🚀 Local server running on http://localhost:3000/${globalPrefix}`);
  });
}