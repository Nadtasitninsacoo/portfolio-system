import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { auth } from '../api/client'
import { OverviewPanel } from './OverviewPanel'
import { ProfilePanel } from './ProfilePanel'
import { ProjectsPanel } from './ProjectsPanel'
import { MessagesPanel } from './MessagesPanel'
import './admin.css'
import './admin.forms.css'
import './admin.cards.css'
import './admin.overview.css'

type Tab = 'overview' | 'profile' | 'projects' | 'messages'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'ภาพรวม' },
  { id: 'profile', label: 'ข้อมูลโปรไฟล์' },
  { id: 'projects', label: 'ผลงาน' },
  { id: 'messages', label: 'ข้อความ' },
]

export function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')

  if (!auth.isLoggedIn()) return <Navigate to="/admin/login" replace />

  const logout = () => {
    auth.clear()
    navigate('/admin/login')
  }

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-brand">◆ แผงควบคุม</div>
        <nav className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-side-foot">
          <a className="admin-link" href="/" target="_blank" rel="noreferrer">
            ดูหน้าเว็บ ↗
          </a>
          <button className="admin-logout" onClick={logout}>
            ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {tab === 'overview' && <OverviewPanel />}
        {tab === 'profile' && <ProfilePanel />}
        {tab === 'projects' && <ProjectsPanel />}
        {tab === 'messages' && <MessagesPanel />}
      </main>
    </div>
  )
}
