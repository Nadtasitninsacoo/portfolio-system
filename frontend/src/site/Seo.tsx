import { useEffect } from 'react'
import { assetUrl } from '../api/client'
import { useSiteData } from './SiteData'

/**
 * ฉีดข้อมูล SEO ลงใน <head>:
 *  - <title> + meta description
 *  - Open Graph (สำหรับแชร์ลิงก์)
 *  - JSON-LD schema.org/Person  (ให้ Google เข้าใจว่าเราเป็นใคร
 *    รวมถึง alumniOf = ประวัติการศึกษา → ขึ้น Knowledge Panel ได้)
 *
 * เป็น client-side rendering — Googlebot รัน JS และอ่าน JSON-LD ที่ฉีดทีหลังได้
 */
export function Seo() {
  const { profile, loading } = useSiteData()

  useEffect(() => {
    // รอจนโหลดข้อมูลจริงจาก backend เสร็จ ค่อยอัปเดต (กันใส่ค่า default)
    if (loading) return

    const origin = window.location.origin
    // ใส่ทั้งชื่อและคีย์เวิร์ดอาชีพ ให้ค้นเจอจากหลายคำ (ชื่อ / โปรแกรมเมอร์ / รับทำเว็บ)
    const title = `${profile.name} · ${profile.role} | รับทำเว็บไซต์ & โปรแกรมเมอร์`
    const description = profile.tagline
    const image = profile.avatarUrl ? assetUrl(profile.avatarUrl) : ''

    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', 'index, follow')
    setMeta('name', 'author', profile.name)
    setMeta(
      'name',
      'keywords',
      [
        profile.name,
        profile.role,
        'รับทำเว็บไซต์',
        'โปรแกรมเมอร์',
        'นักพัฒนาเว็บ',
        'Full-Stack Developer',
        'เว็บแอปพลิเคชัน',
        ...profile.skills,
      ].join(', '),
    )
    setCanonical(`${origin}/`)

    // Open Graph (แชร์ลิงก์บน Facebook/LINE)
    setMeta('property', 'og:type', 'profile')
    setMeta('property', 'og:site_name', profile.name)
    setMeta('property', 'og:locale', 'th_TH')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', `${origin}/`)
    if (image) setMeta('property', 'og:image', image)

    // Twitter card
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    if (image) setMeta('name', 'twitter:image', image)

    // JSON-LD: schema.org/Person
    const ld: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.role,
      description: profile.tagline,
      url: origin,
    }
    if (profile.avatarUrl) ld.image = assetUrl(profile.avatarUrl)
    // วันเกิด: ใส่ให้ Google อย่างเดียว — ไม่แสดงบนหน้าเว็บ (ข้อมูลส่วนตัว)
    if (profile.birthDate) ld.birthDate = profile.birthDate
    if (profile.email) ld.email = `mailto:${profile.email}`
    if (profile.phone) ld.telephone = profile.phone
    if (profile.location) {
      ld.address = { '@type': 'PostalAddress', addressLocality: profile.location }
    }

    const sameAs = profile.socials.map((s) => s.href).filter(Boolean)
    if (sameAs.length) ld.sameAs = sameAs

    if (profile.skills.length) ld.knowsAbout = profile.skills

    const education = (profile.education ?? []).filter((e) => e.school.trim())
    if (education.length) {
      ld.alumniOf = education.map((e) => {
        const org: Record<string, unknown> = {
          '@type': 'EducationalOrganization',
          name: e.school,
        }
        if (e.degree) org.description = e.degree
        return org
      })
    }

    setJsonLd('ld-person', ld)

    // JSON-LD: schema.org/WebSite — ช่วยให้ Google เข้าใจว่านี่คือเว็บไซต์ของใคร
    setJsonLd('ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${profile.name} — ${profile.role}`,
      url: `${origin}/`,
      inLanguage: 'th',
      author: { '@type': 'Person', name: profile.name },
    })
  }, [profile, loading])

  return null
}

/** อัปเดต (หรือสร้าง) แท็ก <link rel="canonical"> */
function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/** อัปเดต (หรือสร้าง) แท็ก <meta> ตาม key ที่ระบุ */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** อัปเดต (หรือสร้าง) แท็ก JSON-LD ตาม id ที่ระบุ */
function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}
