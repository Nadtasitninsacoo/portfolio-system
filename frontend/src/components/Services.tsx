import { useSiteData } from '../site/SiteData'

export function Services() {
  const { profile } = useSiteData()
  return (
    <section id="services" className="section">
      <h2 className="section-title">บริการที่รับ</h2>
      <div className="cards">
        {profile.services.map((s) => (
          <div key={s.title} className="card">
            <span className="card-icon">{s.icon}</span>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
