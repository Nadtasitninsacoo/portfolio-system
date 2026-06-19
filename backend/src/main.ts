import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { AppModule } from './app.module';

// โหลดค่าจากไฟล์ .env ถ้ามี (Node 22+ รองรับในตัว ไม่ต้องลง dotenv)
try {
  process.loadEnvFile();
} catch {
  /* ไม่มีไฟล์ .env ก็ใช้ค่า default */
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // อนุญาตให้ frontend (เช่น Vite dev server) เรียก API ได้
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
  });

  // เสิร์ฟไฟล์รูปที่อัปโหลดผ่าน /uploads
  const uploadDir = process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads');
  mkdirSync(uploadDir, { recursive: true });
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });

  // bind 0.0.0.0 ให้ container บนคลาวด์ (Railway/Render) เข้าถึงได้แน่นอน
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
