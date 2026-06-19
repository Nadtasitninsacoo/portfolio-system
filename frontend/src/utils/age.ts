// คำนวณอายุจากวันเกิด (ISO "YYYY-MM-DD") — อายุจะเพิ่มเองอัตโนมัติเมื่อเวลาผ่านไป
export function calcAge(birthDate?: string): number | null {
  if (!birthDate) return null
  const b = new Date(birthDate)
  if (Number.isNaN(b.getTime())) return null

  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  const monthDiff = now.getMonth() - b.getMonth()
  // ยังไม่ถึงวันเกิดปีนี้ → ลบหนึ่ง
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < b.getDate())) {
    age--
  }
  return age >= 0 && age < 150 ? age : null
}

// แสดงวันเกิดเป็นข้อความไทย เช่น "5 มกราคม 2540"
export function formatThaiDate(birthDate?: string): string {
  if (!birthDate) return ''
  const b = new Date(birthDate)
  if (Number.isNaN(b.getTime())) return ''
  return b.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
