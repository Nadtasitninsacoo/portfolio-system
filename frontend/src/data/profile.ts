// ค่าเริ่มต้น (ใช้แสดงผลตอนยังโหลดข้อมูลจาก API ไม่เสร็จ หรือเชื่อมต่อ backend ไม่ได้)
// ข้อมูลจริงจะถูกแก้ผ่านหน้าแอดมินและเก็บในฐานข้อมูลฝั่ง backend
import type { SiteProfile, Project } from '../api/types'

export const defaultProfile: SiteProfile = {
  name: 'ชื่อ นามสกุล',
  nickname: '',
  role: 'Full-Stack Developer',
  avatarUrl: '',
  coverUrl: '',
  coverPos: 50,
  tagline: 'ออกแบบและพัฒนาเว็บไซต์ และระบบที่ใช้งานได้จริง สวยงาม และตอบโจทย์ธุรกิจ',
  about: [
    'สวัสดีครับ ผมเป็นนักพัฒนาที่หลงใหลในการสร้างผลิตภัณฑ์ดิจิทัลที่มีคุณภาพ ตั้งแต่การออกแบบ UI/UX ไปจนถึงการเขียนระบบหลังบ้านให้ทำงานได้อย่างมั่นคง',
    'ผมรับงานออกแบบและพัฒนาเว็บไซต์ เว็บแอปพลิเคชัน และระบบจัดการข้อมูล หากคุณมีโปรเจกต์ในใจ ติดต่อมาพูดคุยกันได้เลยครับ',
  ],
  location: 'ประเทศไทย',
  birthDate: '',
  availableForWork: true,
  email: 'you@example.com',
  phone: '+66812345678',
  phoneDisplay: '081-234-5678',
  socials: [
    { label: 'GitHub', href: 'https://github.com/yourname' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yourname' },
    { label: 'Facebook', href: 'https://facebook.com/yourname' },
  ],
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'Tailwind CSS',
    'UI / UX Design',
    'REST API',
    'Git',
  ],
  services: [
    {
      icon: '🖥️',
      title: 'พัฒนาเว็บไซต์',
      description: 'เว็บไซต์บริษัท เว็บโปรไฟล์ และ Landing Page ที่โหลดเร็วและรองรับทุกอุปกรณ์',
    },
    {
      icon: '⚙️',
      title: 'เว็บแอปพลิเคชัน',
      description: 'ระบบจัดการข้อมูล แดชบอร์ด และระบบหลังบ้านที่ปรับแต่งตามความต้องการ',
    },
    {
      icon: '🎨',
      title: 'ออกแบบ UI / UX',
      description: 'ออกแบบหน้าตาและประสบการณ์การใช้งานที่สวยงาม เข้าใจง่าย และใช้งานสะดวก',
    },
  ],
  stats: [
    { value: '3+', label: 'ปีประสบการณ์' },
    { value: '20+', label: 'โปรเจกต์ที่ส่งมอบ' },
    { value: '100%', label: 'ความพึงพอใจ' },
  ],
  education: [
    {
      school: 'มหาวิทยาลัยตัวอย่าง',
      degree: 'ปริญญาตรี วิทยาการคอมพิวเตอร์',
      year: '2561 - 2565',
    },
  ],
}

export const defaultProjects: Project[] = [
  {
    id: 1,
    title: 'โปรเจกต์ตัวอย่าง 1',
    description: 'ระบบจัดการร้านค้าออนไลน์ พร้อมแดชบอร์ดสรุปยอดขายแบบเรียลไทม์',
    tags: ['React', 'NestJS', 'PostgreSQL'],
    link: '',
    imageUrl: '',
    images: [],
    gitLink: '',
    sort: 0,
    createdAt: '',
  },
  {
    id: 2,
    title: 'โปรเจกต์ตัวอย่าง 2',
    description: 'เว็บไซต์โปรไฟล์บริษัท ดีไซน์ทันสมัย รองรับมือถือเต็มรูปแบบ',
    tags: ['Next.js', 'Tailwind'],
    link: '',
    imageUrl: '',
    images: [],
    gitLink: '',
    sort: 1,
    createdAt: '',
  },
  {
    id: 3,
    title: 'โปรเจกต์ตัวอย่าง 3',
    description: 'แอปจองคิวออนไลน์ พร้อมระบบแจ้งเตือนผ่านอีเมล',
    tags: ['React', 'Node.js'],
    link: '',
    imageUrl: '',
    images: [],
    gitLink: '',
    sort: 2,
    createdAt: '',
  },
]
