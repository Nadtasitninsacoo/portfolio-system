import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// อัปโหลดรูปขึ้น Cloudinary (cloud storage ฟรี) แล้วคืน URL เต็ม
// ตั้งค่าผ่าน env CLOUDINARY_URL = cloudinary://<api_key>:<api_secret>@<cloud_name>
@Controller('uploads')
export class UploadsController {
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        cb(null, /^image\//.test(file.mimetype));
      },
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('กรุณาเลือกไฟล์รูปภาพ (ไม่เกิน 5MB)');
    if (!process.env.CLOUDINARY_URL) {
      throw new BadRequestException('ยังไม่ได้ตั้งค่า Cloudinary (CLOUDINARY_URL)');
    }

    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio', resource_type: 'image' },
        (err, result) => {
          if (err || !result) reject(err ?? new Error('อัปโหลดไม่สำเร็จ'));
          else resolve(result.secure_url);
        },
      );
      stream.end(file.buffer);
    });

    return { url };
  }
}
