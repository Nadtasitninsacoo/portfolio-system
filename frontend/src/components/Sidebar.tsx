import { navItems, navIds } from '../data/nav'
import { useSiteData } from '../site/SiteData'
import { assetUrl } from '../api/client'
import { useActiveSection } from '../hooks/useActiveSection'
import {
  sectionIcons,
  GithubIcon,
  MailIcon,
  PhoneIcon,
  ChevronIcon,
  SparkleIcon,
  type IconComponent,
} from './Icons'
import { SidebarProfile } from './SidebarProfile'
import './Sidebar.css'
import './Sidebar.profile.css'
import './Sidebar.collapse.css'

interface Shortcut {
  icon: IconComponent
  label: string
  href: string
  external?: boolean
}

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const { profile } = useSiteData()
  const active = useActiveSection(navIds)
  const github = profile.socials.find((s) => s.label === 'GitHub')?.href

  const shortcuts: Shortcut[] = []
  if (github)
    shortcuts.push({ icon: GithubIcon, label: 'GitHub', href: github, external: true })
  shortcuts.push({ icon: MailIcon, label: 'อีเมล', href: `mailto:${profile.email}` })
  shortcuts.push({ icon: PhoneIcon, label: 'โทรศัพท์', href: `tel:${profile.phone}` })

  return (
    <aside
      className={`sidebar${collapsed ? ' is-collapsed' : ''}`}
      aria-label="เมนูหลัก"
    >
      <span className="sb-glow" aria-hidden="true" />

      <div className="sb-top">
        <a className="sb-brand" href="#top" aria-label={profile.name} data-tip={profile.name}>
          <span className={`sb-mark${profile.avatarUrl ? ' has-img' : ''}`}>
            {profile.avatarUrl ? (
              <img src={assetUrl(profile.avatarUrl)} alt={profile.name} />
            ) : (
              '◆'
            )}
          </span>
          <span className="sb-brand-text">
            <strong>{profile.name}</strong>
            <small>{profile.role}</small>
          </span>
        </a>
        <button
          className="sb-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'ขยายเมนู' : 'ย่อเมนู'}
          aria-pressed={collapsed}
        >
          <ChevronIcon />
        </button>
      </div>

      <nav className="sb-nav">
        <span className="sb-label">เมนู</span>
        {navItems.map((item) => {
          const Icon = sectionIcons[item.id] ?? sectionIcons.top
          const isActive = active === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`sb-link${isActive ? ' active' : ''}`}
              data-tip={item.label}
              data-track={`เมนู: ${item.label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="sb-ico">
                <Icon />
              </span>
              <span className="sb-text">{item.label}</span>
            </a>
          )
        })}

        <span className="sb-label">ลัด</span>
        {shortcuts.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="sb-link"
            data-tip={s.label}
            data-track={`ลัด: ${s.label}`}
            target={s.external ? '_blank' : undefined}
            rel={s.external ? 'noreferrer' : undefined}
          >
            <span className="sb-ico">
              <s.icon />
            </span>
            <span className="sb-text">{s.label}</span>
          </a>
        ))}
      </nav>

      <a className="sb-cta" href="#contact" data-tip="จ้างงาน" data-track="CTA: จ้างงานเลย (Sidebar)">
        <span className="sb-ico">
          <SparkleIcon />
        </span>
        <span className="sb-text">จ้างงานเลย</span>
      </a>

      <SidebarProfile />
    </aside>
  )
}
