import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Project } from '../api/types'
import { ProjectCard } from './ProjectCard'

export function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    api<Project[]>('/projects')
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  const add = async () => {
    await api('/projects', {
      method: 'POST',
      authed: true,
      body: { title: 'โปรเจกต์ใหม่', sort: projects.length },
    })
    load()
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>ผลงาน ({projects.length})</h2>
        <button className="btn btn-primary" onClick={add}>
          + เพิ่มผลงาน
        </button>
      </div>

      {loading ? (
        <p className="muted">กำลังโหลด...</p>
      ) : projects.length === 0 ? (
        <p className="muted">ยังไม่มีผลงาน กด "เพิ่มผลงาน" เพื่อเริ่มต้น</p>
      ) : (
        <div className="proj-list">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  )
}
