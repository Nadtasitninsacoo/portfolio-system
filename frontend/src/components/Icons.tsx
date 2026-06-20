// ไอคอนแบบเส้น (line icons) ขนาดเล็ก ใช้ currentColor เพื่อรับสีจาก CSS
import type { FC, SVGProps } from 'react'

export type IconComponent = FC<SVGProps<SVGSVGElement>>

const Base: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  />
)

export const HomeIcon: IconComponent = (p) => (
  <Base {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </Base>
)

export const UserIcon: IconComponent = (p) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </Base>
)

export const ServicesIcon: IconComponent = (p) => (
  <Base {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Base>
)

export const FolderIcon: IconComponent = (p) => (
  <Base {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </Base>
)

export const MailIcon: IconComponent = (p) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Base>
)

export const PhoneIcon: IconComponent = (p) => (
  <Base {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </Base>
)

export const GithubIcon: IconComponent = (p) => (
  <Base {...p}>
    <path d="M9 19c-4 1.4-4-2-6-2.5m12 5v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.4 0C6.5 2.8 5.4 3.1 5.4 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21" />
  </Base>
)

export const ChevronIcon: IconComponent = (p) => (
  <Base {...p}>
    <path d="m15 6-6 6 6 6" />
  </Base>
)

export const SparkleIcon: IconComponent = (p) => (
  <Base {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
    <path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z" />
  </Base>
)

// แฮ็กเกอร์นิรนาม (รูปฮู้ด) — ใช้แทนรูปโปรไฟล์เมื่อยังไม่ได้อัปโหลดรูป
export const HackerIcon: IconComponent = (p) => (
  <Base {...p}>
    <path d="M12 3C8.7 3 6 5.7 6 9c0 1.6.6 3 1.6 4L5 20.5h14L16.4 13c1-1 1.6-2.4 1.6-4 0-3.3-2.7-6-6-6Z" />
    <path d="M9 10.8h2.2" />
    <path d="M12.8 10.8H15" />
  </Base>
)

// แมป id ของเมนู -> ไอคอน
export const sectionIcons: Record<string, IconComponent> = {
  top: HomeIcon,
  about: UserIcon,
  services: ServicesIcon,
  projects: FolderIcon,
  contact: MailIcon,
}
