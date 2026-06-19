// ตัวเรียก API กลาง + จัดการ token ของแอดมิน
export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const TOKEN_KEY = 'admin-token'

export const auth = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
}

// แปลง path ของรูป (/uploads/..) ให้เป็น URL เต็ม
export function assetUrl(path?: string): string {
  if (!path) return ''
  return /^https?:\/\//.test(path) ? path : `${API_BASE}${path}`
}

interface Options {
  method?: string
  body?: unknown
  authed?: boolean
}

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'
  if (opts.authed) {
    const token = auth.get()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })

  if (res.status === 401) {
    auth.clear()
    throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่')
  }
  if (!res.ok) {
    const msg = await res.json().catch(() => null)
    throw new Error(msg?.message ?? 'เกิดข้อผิดพลาดในการเชื่อมต่อ')
  }
  return res.json() as Promise<T>
}

// อัปโหลดรูป (multipart) — คืนค่า { url }
export async function uploadImage(file: File): Promise<{ url: string }> {
  const data = new FormData()
  data.append('file', file)
  const res = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${auth.get() ?? ''}` },
    body: data,
  })
  if (res.status === 401) {
    auth.clear()
    throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่')
  }
  if (!res.ok) {
    const msg = await res.json().catch(() => null)
    throw new Error(msg?.message ?? 'อัปโหลดรูปไม่สำเร็จ (ไฟล์ต้องเป็นรูปภาพ ไม่เกิน 5MB)')
  }
  return res.json() as Promise<{ url: string }>
}
