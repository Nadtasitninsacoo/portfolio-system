import { useEffect, useRef } from 'react'
import './WaveBackground.css'

/**
 * พื้นหลังเคลื่อนไหว: เส้นบางหลายสิบเส้น "ทอ" กันเป็นริบบิ้นคลื่น
 * ไล่สีชมพูม่วง → ม่วง บนพื้นดำ (สไตล์ sound-wave / blend art)
 *
 * เทคนิค: เส้นที่ i คือ  y = แกนกลาง(x) + แอมพลิจูด(x) * sin(x) * spread_i
 * โดย spread ไล่จาก +1 ถึง -1 ทำให้เส้นบีบรวมเป็นจุด (node) ตรงที่ sin = 0
 * และคลี่ออกเป็นห่วงตรงกลางช่วง — ขยับเฟสตามเวลาให้ไหลตลอด
 */
export function WaveBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const N = 58 // จำนวนเส้น
    const TWO_PI = Math.PI * 2

    const draw = (time: number) => {
      const t = time * 0.00012

      // พื้นหลังดำ
      ctx.fillStyle = '#080711'
      ctx.fillRect(0, 0, w, h)

      // ไล่สีชมพูม่วง (ซ้าย) → ม่วง (ขวา)
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, 'rgba(240, 40, 255, 0.5)')
      grad.addColorStop(0.5, 'rgba(180, 45, 255, 0.45)')
      grad.addColorStop(1, 'rgba(120, 50, 255, 0.45)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 0.6
      ctx.globalCompositeOperation = 'lighter' // เส้นซ้อนกันแล้วสว่างขึ้น

      const midBase = h * 0.5
      const A = h * 0.17 // แอมพลิจูดหลัก
      const B = h * 0.1 // การส่ายของแกนกลาง
      const k = (TWO_PI * 2.3) / w
      const k2 = (TWO_PI * 1.3) / w
      const k3 = (TWO_PI * 1.7) / w
      const step = Math.max(4, Math.floor(w / 260))

      const p1 = t
      const p2 = t * 0.7 + 1.0
      const p3 = t * 1.3 + 2.0

      for (let i = 0; i < N; i++) {
        const spread = 1 - (2 * i) / (N - 1) // +1 .. -1
        ctx.beginPath()
        for (let x = -20; x <= w + 20; x += step) {
          const base = Math.sin(x * k + p1)
          const mid = midBase + B * Math.sin(x * k2 + p2)
          const amp = A * (0.45 + 0.55 * Math.sin(x * k3 + p3))
          const y = mid + amp * base * spread
          if (x === -20) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      ctx.globalCompositeOperation = 'source-over'
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="wave-bg" aria-hidden="true" />
}
