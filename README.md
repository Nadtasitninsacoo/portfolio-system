# portfolio-system

เว็บพอร์ตโฟลิโอส่วนตัว + ระบบหลังบ้าน (admin) จัดการข้อมูลเอง

## โครงสร้าง
- **frontend/** — เว็บสาธารณะ + หน้าแอดมิน (React + Vite + TypeScript)
- **backend/** — API (NestJS + SQLite)

## ฟีเจอร์
- หน้าเว็บโปรไฟล์: รูปปก/โปรไฟล์, ประวัติการศึกษา, ทักษะ, ผลงาน (แกลเลอรีหลายรูป), ติดต่อ
- หลังบ้าน: แก้ข้อมูลทุกส่วน, อัปโหลดรูป, จัดการผลงาน/ข้อความ
- สถิติผู้เข้าชม (กราฟภาพรวม) + แจ้งเตือนอีเมลเมื่อมีคนติดต่อ
- SEO (schema.org JSON-LD) ให้ Google ค้นเจอ

## เริ่มใช้งาน (dev)
```bash
# backend
cd backend && npm install && npm run start

# frontend
cd frontend && npm install && npm run dev
```

ตั้งค่า environment variables ตาม `backend/.env.example`
