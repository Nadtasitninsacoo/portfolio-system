import { useState } from 'react'
import { useSiteData } from '../site/SiteData'
import { assetUrl } from '../api/client'
import { displayName } from '../utils/displayName'
import { HackerIcon } from './Icons'
import { Lightbox } from './Lightbox'
import './Hero.css'

export function Hero() {
  const { profile } = useSiteData()
  const name = displayName(profile.name)
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null)

  const avatarSrc = profile.avatarUrl ? assetUrl(profile.avatarUrl) : ''
  const coverSrc = profile.coverUrl ? assetUrl(profile.coverUrl) : ''

  return (
    <section id="top" className="hero">
      <div
        className={`hero-cover${profile.coverUrl ? ' has-img clickable' : ''}`}
        style={
          coverSrc
            ? {
                backgroundImage: `url(${coverSrc})`,
                backgroundPosition: `center ${profile.coverPos ?? 50}%`,
              }
            : undefined
        }
        onClick={coverSrc ? () => setZoom({ src: coverSrc, alt: 'รูปปก' }) : undefined}
      >
        <span className="hero-cover-overlay" aria-hidden="true" />
        {profile.availableForWork && (
          <span className="badge hero-badge">
            <span className="dot" /> เปิดรับงานอยู่ตอนนี้
          </span>
        )}
      </div>

      <div className="hero-body">
        <div className="hero-avatar-wrap">
          <span
            className={`hero-avatar${profile.avatarUrl ? ' has-img clickable' : ''}`}
            role={avatarSrc ? 'button' : undefined}
            tabIndex={avatarSrc ? 0 : undefined}
            aria-label={avatarSrc ? 'ดูรูปโปรไฟล์เต็ม' : undefined}
            onClick={avatarSrc ? () => setZoom({ src: avatarSrc, alt: name }) : undefined}
            onKeyDown={
              avatarSrc
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setZoom({ src: avatarSrc, alt: name })
                    }
                  }
                : undefined
            }
          >
            {profile.avatarUrl ? (
              <img src={avatarSrc} alt={name} />
            ) : (
              <HackerIcon width="55%" height="55%" />
            )}
          </span>
          {profile.nickname && (
            <span className="hero-nick">{profile.nickname}</span>
          )}
        </div>
        <div className="hero-name">
          <h1 className="hero-title">
            {name}
            <VerifiedBadge />
          </h1>
          <span className="role">{profile.role}</span>
        </div>
        <p className="tagline">{profile.tagline}</p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-primary" data-track="Hero: จ้างงาน/ติดต่อ">
            จ้างงาน / ติดต่อ
          </a>
          <a href="#projects" className="btn btn-ghost" data-track="Hero: ดูผลงาน">
            ดูผลงาน
          </a>
        </div>
        {profile.stats.length > 0 && (
          <div className="stats">
            {profile.stats.map((s, i) => (
              <div key={i} className="stat">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {zoom && (
        <Lightbox src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />
      )}
    </section>
  )
}

// ตรายืนยันตัวตน (สไตล์เฟสบุ๊ก แต่โทนเหลืองตามเอกลักษณ์เรา)
function VerifiedBadge() {
  return (
    <svg className="verified" viewBox="0 0 24 24" role="img" aria-label="ยืนยันตัวตน">
      <path
        className="verified-seal"
        d="M22.5 12.5c0-1.58-.88-2.95-2.15-3.6.15-.44.24-.9.24-1.4 0-2.21-1.71-4-3.82-4-.47 0-.92.08-1.34.25C14.82 2.42 13.51 1.5 12 1.5s-2.82.92-3.44 2.25c-.42-.17-.87-.25-1.34-.25-2.11 0-3.82 1.79-3.82 4 0 .5.08.96.24 1.4-1.27.65-2.15 2.02-2.15 3.6 0 1.5.78 2.8 1.94 3.49-.02.17-.03.34-.03.51 0 2.21 1.71 4 3.82 4 .47 0 .92-.09 1.34-.25.62 1.33 1.93 2.25 3.44 2.25s2.82-.92 3.44-2.25c.42.16.87.25 1.34.25 2.11 0 3.82-1.79 3.82-4 0-.17-.01-.34-.03-.51 1.16-.69 1.94-1.99 1.94-3.49z"
      />
      <path
        className="verified-check"
        d="M9.8 16.3 6.2 12.7 7.6 11.3 9.8 13.5 16.4 6.9 17.8 8.3z"
      />
    </svg>
  )
}
