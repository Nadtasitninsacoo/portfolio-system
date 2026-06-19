import { useEffect, useRef } from 'react'
import './MatrixRain.css'

// ชุดอักขระคล้ายโค้ด (คาตาคานะ + ตัวเลข + สัญลักษณ์โปรแกรม)
const CHARS =
  'アイウエオカキクケコサシスセソタチツテト0123456789{}[]<>/\\=;:$#&*+ABCDEF'.split('')

export function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fontSize = 16
    let columns = 0
    let drops: number[] = []
    let raf = 0
    let last = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      columns = Math.floor(canvas.width / fontSize)
      drops = new Array(columns).fill(0).map(() => Math.random() * -50)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (t - last < 45) return // จำกัด ~22fps ให้ตกช้าพอดี
      last = t

      // ทับด้วยดำโปร่งเพื่อสร้างหางจางๆ
      ctx.fillStyle = 'rgba(10, 11, 14, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < columns; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        // หัวสายสว่าง
        ctx.fillStyle = i % 9 === 0 ? '#ffffcc' : 'rgba(255, 255, 0, 0.8)'
        ctx.fillText(ch, x, y)

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="matrix-rain" aria-hidden="true" />
}
