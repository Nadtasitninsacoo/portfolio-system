import { useRef, useState } from 'react'
import { useSiteData } from '../site/SiteData'
import { assetUrl } from '../api/client'
import { Lightbox } from './Lightbox'
import type { Project } from '../api/types'
import './Projects.css'

export function Projects() {
  const { projects } = useSiteData()
  const [zoom, setZoom] = useState<string | null>(null)

  return (
    <section id="projects" className="section">
      <h2 className="section-title">ผลงานที่ผ่านมา</h2>
      <div className="cards">
        {projects.map((p) => (
          <ProjectItem key={p.id} project={p} onZoom={setZoom} />
        ))}
      </div>

      {zoom && <Lightbox src={zoom} alt="ผลงาน" onClose={() => setZoom(null)} />}
    </section>
  )
}

function ProjectItem({
  project: p,
  onZoom,
}: {
  project: Project
  onZoom: (src: string) => void
}) {
  // รวมรูป: ใช้ images ก่อน ถ้าไม่มีค่อย fallback เป็น imageUrl เดิม
  const images = p.images?.length ? p.images : p.imageUrl ? [p.imageUrl] : []
  const liveLink = p.link && p.link !== '#' ? p.link : ''

  return (
    <div className="card project">
      {images.length > 0 && (
        <ProjectGallery images={images} alt={p.title} onZoom={onZoom} />
      )}
      <h3>{p.title}</h3>
      <p>{p.description}</p>
      {p.tags.length > 0 && (
        <div className="chips">
          {p.tags.map((t) => (
            <span key={t} className="chip chip-sm">
              {t}
            </span>
          ))}
        </div>
      )}
      {(liveLink || p.gitLink) && (
        <div className="project-links">
          {liveLink && (
            <a
              className="proj-link"
              href={liveLink}
              target="_blank"
              rel="noreferrer"
              data-track={`ผลงาน-เว็บ: ${p.title}`}
            >
              🔗 ดูเว็บ
            </a>
          )}
          {p.gitLink && (
            <a
              className="proj-link git"
              href={p.gitLink}
              target="_blank"
              rel="noreferrer"
              data-track={`ผลงาน-GitHub: ${p.title}`}
            >
              <GitIcon /> GitHub
            </a>
          )}
        </div>
      )}
    </div>
  )
}

// แกลเลอรีเลื่อน/ปัดดูหลายรูป (scroll-snap) + ลูกศร + จุดบอกตำแหน่ง
function ProjectGallery({
  images,
  alt,
  onZoom,
}: {
  images: string[]
  alt: string
  onZoom: (src: string) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)

  const go = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const n = Math.max(0, Math.min(images.length - 1, i))
    el.scrollTo({ left: el.clientWidth * n, behavior: 'smooth' })
    setIdx(n)
  }

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    setIdx(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className="pgal">
      <div className="pgal-track" ref={trackRef} onScroll={onScroll}>
        {images.map((src, i) => (
          <img
            key={i}
            className="pgal-img"
            src={assetUrl(src)}
            alt={`${alt} ${i + 1}`}
            loading="lazy"
            onClick={() => onZoom(assetUrl(src))}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="pgal-nav prev"
            aria-label="รูปก่อนหน้า"
            onClick={() => go(idx - 1)}
          >
            ‹
          </button>
          <button
            className="pgal-nav next"
            aria-label="รูปถัดไป"
            onClick={() => go(idx + 1)}
          >
            ›
          </button>
          <div className="pgal-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`pgal-dot${i === idx ? ' active' : ''}`}
                aria-label={`ไปรูปที่ ${i + 1}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <span className="pgal-count">
            {idx + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  )
}

function GitIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  )
}
