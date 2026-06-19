import { useEffect } from 'react'
import { track } from './analytics'

/**
 * ติดตามพฤติกรรมผู้เข้าชม (ฝั่งหน้าเว็บสาธารณะ):
 *  - บันทึก 1 view ต่อการเปิดหน้า
 *  - บันทึก click ขององค์ประกอบที่ติดป้าย data-track="..." (ชอบกดตรงไหน)
 */
export function AnalyticsTracker() {
  useEffect(() => {
    track('view')

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const el = target?.closest('[data-track]')
      if (el) track('click', el.getAttribute('data-track') || '')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
