import { useEffect, useState } from 'react'
import { navItems } from '../data/nav'
import { useSiteData } from '../site/SiteData'
import './Navbar.css'

export function Navbar() {
  const { profile } = useSiteData()
  const [open, setOpen] = useState(false)

  // ปิดเมนูอัตโนมัติเมื่อขยายเป็นจอใหญ่ (กลับไปใช้ Sidebar)
  useEffect(() => {
    if (!open) return
    const onResize = () => {
      if (window.innerWidth > 1024) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open])

  // ล็อกการสกรอลล์พื้นหลังเมื่อเมนูเปิด (เฉพาะมือถือ)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`nav${open ? ' is-open' : ''}`}>
      <div className="nav-bar">
        <a className="nav-logo" href="#top" onClick={close}>
          {profile.name}
        </a>
        <button
          className="nav-burger"
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className="nav-menu" aria-hidden={!open}>
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="nav-menu-link"
            onClick={close}
          >
            {item.label}
          </a>
        ))}
        <a href="#contact" className="nav-menu-cta" onClick={close}>
          จ้างงานเลย
        </a>
      </nav>
    </header>
  )
}
