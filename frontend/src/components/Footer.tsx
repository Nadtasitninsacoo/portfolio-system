import { useSiteData } from '../site/SiteData'
import './Footer.css'

export function Footer() {
  const { profile } = useSiteData()
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {profile.name} · สร้างด้วย React + NestJS
      </p>
      <p className="footer-note">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime commodi
        nulla repellendus,{' '}
        <a className="footer-secret" href="/admin/login">
          systema
        </a>{' '}
        voluptatem quibusdam eligendi sed natus, autem dolore consequatur
        accusantium quia.
      </p>
    </footer>
  )
}
