import { API_BASE } from '../api/client'

const VID_KEY = 'visitor-id'

// id ผู้เข้าชมแบบนิรนาม (เก็บใน localStorage) — ใช้นับผู้เข้าชมไม่ซ้ำ ไม่มีข้อมูลส่วนตัว
export function getVisitorId(): string {
  let id = localStorage.getItem(VID_KEY)
  if (!id) {
    id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 1e9)}`
    localStorage.setItem(VID_KEY, id)
  }
  return id
}

// ส่ง event แบบ fire-and-forget (ล้มเหลวก็ไม่กระทบหน้าเว็บ)
export function track(type: 'view' | 'click', label = ''): void {
  try {
    fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, label, visitorId: getVisitorId() }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* เงียบไว้ */
  }
}
