// ชนิดข้อมูลที่ใช้ร่วมกันระหว่างหน้าเว็บสาธารณะและหน้าแอดมิน
export interface Social {
  label: string
  href: string
}
export interface Service {
  icon: string
  title: string
  description: string
}
export interface Stat {
  value: string
  label: string
}
export interface Education {
  school: string // สถาบันการศึกษา
  degree: string // วุฒิ / สาขาที่จบ
  year: string // ช่วงปี เช่น "2561 - 2565"
}

export interface SiteProfile {
  name: string
  seoKeywords: string // ชื่ออื่นๆ/คำค้นหาสำหรับ Google (ไม่แสดงบนหน้าเว็บ) เช่นชื่อไทย-อังกฤษ
  nickname: string // ชื่อเล่น — โชว์เป็นป้ายมุมรูปโปรไฟล์ (แบบสถานะ Facebook)
  role: string
  avatarUrl: string
  coverUrl: string // รูปปกสไตล์ Facebook (แบนเนอร์บนการ์ด Hero)
  coverPos: number // ตำแหน่งแนวตั้งของรูปปก 0-100 (%) — ปรับได้แบบ Facebook
  tagline: string
  about: string[]
  location: string
  birthDate: string // วันเกิดรูปแบบ ISO "YYYY-MM-DD" (อายุคำนวณอัตโนมัติ)
  availableForWork: boolean
  email: string
  phone: string
  phoneDisplay: string
  socials: Social[]
  skills: string[]
  services: Service[]
  stats: Stat[]
  education: Education[]
}

export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  link: string
  imageUrl: string // รูปหลัก (เก่า) — ใช้เป็น fallback
  images: string[] // รูปหลายรูปต่อผลงาน (แกลเลอรีเลื่อนดู)
  gitLink: string // ลิงก์ GitHub
  sort: number
  createdAt: string
}

export interface Message {
  id: number
  name: string
  email: string
  message: string
  isRead: number
  createdAt: string
}
