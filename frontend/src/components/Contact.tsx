import { useSiteData } from '../site/SiteData'
import { ContactForm } from './ContactForm'
import './Contact.css'

export function Contact() {
  const { profile } = useSiteData()
  return (
    <section id="contact" className="section contact">
      <h2 className="section-title">ติดต่อ / ว่าจ้าง</h2>
      <p className="contact-sub">
        สนใจร่วมงานหรือมีโปรเจกต์ในใจ? ติดต่อมาได้เลยครับ ยินดีพูดคุย
      </p>
      <div className="contact-grid">
        <div className="contact-info">
          <a className="contact-item" href={`tel:${profile.phone}`}>
            <span className="contact-label">โทรศัพท์</span>
            <span className="contact-value">{profile.phoneDisplay}</span>
          </a>
          <a className="contact-item" href={`mailto:${profile.email}`}>
            <span className="contact-label">อีเมล</span>
            <span className="contact-value">{profile.email}</span>
          </a>
          <div className="contact-socials">
            {profile.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}
