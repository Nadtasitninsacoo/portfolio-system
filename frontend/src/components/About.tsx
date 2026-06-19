import { useSiteData } from '../site/SiteData'
import './About.css'

export function About() {
  const { profile } = useSiteData()
  return (
    <section id="about" className="section">
      <h2 className="section-title">เกี่ยวกับฉัน</h2>
      <div className="about">
        <div className="about-text">
          {profile.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="about-meta">📍 {profile.location}</p>
        </div>
        <div className="about-aside">
          <div className="skills-card">
            <h3>ทักษะ &amp; เครื่องมือ</h3>
            <div className="chips">
              {profile.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
          {profile.education?.length > 0 && (
            <div className="skills-card edu-card">
              <h3>ประวัติการศึกษา</h3>
              <ul className="edu-list">
                {profile.education.map((e, i) => (
                  <li key={i} className="edu-item">
                    <span className="edu-school">{e.school}</span>
                    {e.degree && <span className="edu-degree">{e.degree}</span>}
                    {e.year && <span className="edu-year">{e.year}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
