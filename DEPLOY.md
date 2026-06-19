# คู่มือ Deploy

สถาปัตยกรรม: **Frontend → Vercel** · **Backend (NestJS + SQLite) → Railway หรือ Render**

ฐานข้อมูลเป็นไฟล์ SQLite (`node:sqlite` ในตัว Node) จึงต้องวางไว้บน **persistent disk**
ของโฮสต์ฝั่ง backend — ไม่ใช่ Vercel (เพราะ Vercel เป็น serverless ไฟล์จะหาย)

---

## 1) Backend — Railway (แนะนำ ตั้งค่าง่าย)

1. สร้างโปรเจกต์ใหม่บน [railway.app](https://railway.app) → Deploy from GitHub repo (เลือกโฟลเดอร์ `backend`)
2. Railway ตรวจเจอ Node อัตโนมัติ ตั้ง start command เป็น `npm run start:prod`
3. เพิ่ม **Volume**: Settings → Volumes → Mount path = `/data`
4. ตั้ง **Variables**:
   - `ADMIN_USERNAME` = ชื่อผู้ใช้แอดมิน
   - `ADMIN_PASSWORD` = รหัสผ่านที่คาดเดายาก
   - `JWT_SECRET` = ค่าสุ่มยาว ๆ (เช่นจาก `openssl rand -hex 32`)
   - `CORS_ORIGIN` = โดเมน Vercel เช่น `https://your-app.vercel.app`
   - `DB_PATH` = `/data/data.sqlite`
   - `UPLOAD_DIR` = `/data/uploads`
5. Deploy → จดโดเมนที่ได้ เช่น `https://portfolio-api.up.railway.app`

## 1) ทางเลือก — Render

- มีไฟล์ [`backend/render.yaml`](backend/render.yaml) เป็น blueprint ให้แล้ว
- New → Blueprint → เลือก repo backend → Render อ่าน `render.yaml` และสร้าง service + disk ให้
- กรอก `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `CORS_ORIGIN` ในแดชบอร์ด
- ⚠️ ต้องเป็นแพลน **Starter ขึ้นไป** เพราะ disk ใช้กับแพลน free ไม่ได้ (free จะทำให้ข้อมูลหาย)

---

## 2) Frontend — Vercel

1. New Project บน [vercel.com](https://vercel.com) → เลือก repo โฟลเดอร์ `frontend`
2. Framework Preset: **Vite** (ตรวจเจ้ออัตโนมัติ) — มี [`frontend/vercel.json`](frontend/vercel.json)
   จัดการ SPA routing ให้แล้ว (`/admin` รีเฟรชแล้วไม่ 404)
3. ตั้ง **Environment Variable**:
   - `VITE_API_URL` = โดเมน backend จากขั้นที่ 1 เช่น `https://portfolio-api.up.railway.app`
   - ⚠️ ต้องตั้ง **ก่อน build** และถ้าแก้ค่าต้อง **Redeploy** (Vite ฝังค่าตอน build)
4. Deploy → ได้โดเมน เช่น `https://your-app.vercel.app`

---

## 3) เชื่อมให้ครบ (สำคัญ)

ค่า `CORS_ORIGIN` (backend) กับ `VITE_API_URL` (frontend) ต้องชี้หากันให้ถูก:

| ตัวแปร | อยู่ที่ | ค่า |
|--------|--------|-----|
| `VITE_API_URL` | Vercel | โดเมน backend |
| `CORS_ORIGIN` | Railway/Render | โดเมน frontend (Vercel) |

ถ้าใช้โดเมนของตัวเอง (custom domain) อย่าลืมอัปเดตทั้งสองค่าให้ตรงโดเมนจริง

---

## ✅ เช็กลิสต์สิ่งที่คุณต้องทำเอง

- [ ] เปลี่ยน `ADMIN_USERNAME` / `ADMIN_PASSWORD` (ห้ามใช้ `admin` / `admin1234`)
- [ ] ตั้ง `JWT_SECRET` เป็นค่าสุ่มยาว ๆ
- [ ] เปิด persistent volume/disk แล้วชี้ `DB_PATH` + `UPLOAD_DIR` ไปที่นั่น
- [ ] ตั้ง `VITE_API_URL` บน Vercel ให้ชี้ backend
- [ ] ตั้ง `CORS_ORIGIN` บน backend ให้ชี้ frontend
- [ ] (ถ้ามี) ผูก custom domain + ตรวจว่า HTTPS ทำงาน
- [ ] เข้า `/admin/login` ทดสอบล็อกอิน + เพิ่มผลงาน + อัปโหลดรูป

## หมายเหตุ
- Backend ต้องรันบน **Node ≥ 22.5** (กำหนดไว้แล้วใน `engines` + `.nvmrc`) เพราะใช้ SQLite ในตัว Node
- ครั้งแรกที่รัน ระบบจะ seed ข้อมูลตัวอย่างให้อัตโนมัติ จากนั้นแก้ผ่านหน้าแอดมินได้เลย
- ไฟล์ `data.sqlite` และโฟลเดอร์ `uploads` ถูกใส่ใน `.gitignore` แล้ว (ไม่ขึ้น git)
