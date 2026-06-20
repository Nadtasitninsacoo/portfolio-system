import { useSiteData } from '../site/SiteData'
import { assetUrl } from '../api/client'
import { displayName } from '../utils/displayName'
import { HackerIcon } from './Icons'

export function SidebarProfile() {
  const { profile } = useSiteData()
  const name = displayName(profile.name)
  return (
    <a className="sb-profile" href="#contact" data-tip={name}>
      <span className={`sb-avatar${profile.avatarUrl ? ' has-img' : ''}`}>
        {profile.avatarUrl ? (
          <img src={assetUrl(profile.avatarUrl)} alt={name} />
        ) : (
          <HackerIcon width="62%" height="62%" />
        )}
        {profile.availableForWork && <span className="sb-avatar-dot" />}
      </span>
      <span className="sb-profile-text">
        <strong>{name}</strong>
        <small>{profile.role}</small>
      </span>
    </a>
  )
}
