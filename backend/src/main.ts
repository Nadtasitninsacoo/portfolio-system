import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// load env (Node 22+)
try {
  process.loadEnvFile();
} catch {
  /* ไม่มีไฟล์ .env ก็ใช้ค่า default / env ของโฮสต์ */
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // อนุญาตให้ frontend เรียก API ได้ (ใส่โดเมน Vercel ใน CORS_ORIGIN)
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  });

  // bind 0.0.0.0 ให้ container บนคลาวด์ (Render) เข้าถึงได้
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
