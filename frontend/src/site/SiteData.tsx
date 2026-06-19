import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/client'
import type { SiteProfile, Project } from '../api/types'
import { defaultProfile, defaultProjects } from '../data/profile'

interface SiteData {
  profile: SiteProfile
  projects: Project[]
  loading: boolean
}

const SiteDataContext = createContext<SiteData>({
  profile: defaultProfile,
  projects: defaultProjects,
  loading: true,
})

export function useSiteData() {
  return useContext(SiteDataContext)
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<SiteProfile>(defaultProfile)
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([
      api<Partial<SiteProfile>>('/profile'),
      api<Project[]>('/projects'),
    ])
      .then(([p, pr]) => {
        if (!alive) return
        if (p && Object.keys(p).length) setProfile({ ...defaultProfile, ...p })
        if (Array.isArray(pr) && pr.length) setProjects(pr)
      })
      .catch(() => {
        /* เชื่อมต่อ backend ไม่ได้ — ใช้ค่าเริ่มต้นไปก่อน */
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <SiteDataContext.Provider value={{ profile, projects, loading }}>
      {children}
    </SiteDataContext.Provider>
  )
}
