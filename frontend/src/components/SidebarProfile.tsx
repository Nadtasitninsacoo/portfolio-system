import { useSiteData } from '../site/SiteData'
import { assetUrl } from '../api/client'

export function SidebarProfile() {
  const { profile } = useSiteData()
  const initial = profile.name.trim().charAt(0) || '◆'
  return (
    <a className="sb-profile" href="#contact" data-tip={profile.name}>
      <span className={`sb-avatar${profile.avatarUrl ? ' has-img' : ''}`}>
        {profile.avatarUrl ? (
          <img src={assetUrl(profile.avatarUrl)} alt={profile.name} />
        ) : (
          initial
        )}
        {profile.availableForWork && <span className="sb-avatar-dot" />}
      </span>
      <span className="sb-profile-text">
        <strong>{profile.name}</strong>
        <small>{profile.role}</small>
      </span>
    </a>
  )
}
