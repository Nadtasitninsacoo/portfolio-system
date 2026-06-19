import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { AppModule } from './app.module';

// โหลด env (Node 22+)
try {
  process.loadEnvFile();
} catch {}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ สำคัญ: ให้ Railway / Cloud เข้าถึงได้
  const port = Number(process.env.PORT || 3000);

  await app.listen(port, '0.0.0.0');

  // CORS (frontend Vercel)
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  });

  // Upload folder (ต้องอยู่ใน /data บน Railway)
  const uploadDir =
    process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads');

  mkdirSync(uploadDir, { recursive: true });
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
