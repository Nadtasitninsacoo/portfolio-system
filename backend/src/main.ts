import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { AppModule } from './app.module';

// load env (Node 22+)
try {
  process.loadEnvFile();
} catch {}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const port = Number(process.env.PORT || 3000);

  // ✅ CORS ต้องมาก่อน
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  });

  // ✅ upload folder
  const uploadDir =
    process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads');

  mkdirSync(uploadDir, { recursive: true });
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });

  // 🚀 ค่อย start server ทีหลังสุด
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
