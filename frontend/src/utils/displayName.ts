// ชื่อที่แสดงผล — ถ้ายังไม่ได้ตั้งค่าชื่อ (ว่างหรือมีแต่ช่องว่าง) ให้ใช้ "Anonymous"
export function displayName(name?: string): string {
  return name?.trim() || 'Anonymous'
}
