import { useState } from 'react'
import { api, uploadImage, assetUrl } from '../api/client'
import type { Project } from '../api/types'

export function ProjectCard({
  project,
  onChanged,
}: {
  project: Project
  onChanged: () => void
}) {
  // รวมรูปเก่า (imageUrl) เข้ากับ images ให้เป็นอาเรย์เดียว
  const [p, setP] = useState<Project>(() => ({
    ...project,
    images:
      project.images?.length
        ? project.images
        : project.imageUrl
          ? [project.imageUrl]
          : [],
  }))
  const [busy, setBusy] = useState('')
  const [err, setErr] = useState('')

  const set = <K extends keyof Project>(k: K, v: Project[K]) =>
    setP((prev) => ({ ...prev, [k]: v }))

  const save = async () => {
    setBusy('saving')
    try {
      await api(`/projects/${p.id}`, {
        method: 'PUT',
        authed: true,
        body: {
          title: p.title,
          description: p.description,
          tags: p.tags,
          link: p.link,
          images: p.images,
          imageUrl: p.images[0] ?? '', // sync รูปหลักไว้เผื่อระบบเก่า
          gitLink: p.gitLink,
          sort: p.sort,
        },
      })
      onChanged()
    } finally {
      setBusy('')
    }
  }

  const remove = async () => {
    if (!confirm(`ลบผลงาน "${p.title}" ?`)) return
    await api(`/projects/${p.id}`, { method: 'DELETE', authed: true })
    onChanged()
  }

  // อัปโหลดได้ทีละหลายรูป — ต่อท้ายเข้าแกลเลอรี
  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length) return
    setErr('')
    setBusy('uploading')
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const { url } = await uploadImage(file)
        urls.push(url)
      }
      set('images', [...p.images, ...urls])
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'อัปโหลดรูปไม่สำเร็จ')
    } finally {
      setBusy('')
    }
  }

  // เปลี่ยนรูปเฉพาะตำแหน่งนี้ (อัปไฟล์ใหม่ แทนที่ในตำแหน่งเดิม)
  const replaceImage = async (i: number, file?: File) => {
    if (!file) return
    setErr('')
    setBusy('uploading')
    try {
      const { url } = await uploadImage(file)
      set('images', p.images.map((src, j) => (j === i ? url : src)))
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'อัปโหลดรูปไม่สำเร็จ')
    } finally {
      setBusy('')
    }
  }

  const removeImage = (i: number) =>
    set('images', p.images.filter((_, j) => j !== i))

  const moveImage = (i: number, dir: -1 | 1) => {
    const next = [...p.images]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    set('images', next)
  }

  return (
    <div className="proj-card">
      <div className="proj-img-box">
        {p.images.length > 0 ? (
          <div className="proj-thumbs">
            {p.images.map((src, i) => (
              <div key={i} className="proj-thumb">
                <img src={assetUrl(src)} alt="" />
                <div className="proj-thumb-bar">
                  <button title="เลื่อนซ้าย" onClick={() => moveImage(i, -1)}>
                    ‹
                  </button>
                  <label className="thumb-replace" title="เปลี่ยนรูปนี้">
                    ⟳
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => replaceImage(i, e.target.files?.[0])}
                    />
                  </label>
                  <button title="ลบรูปนี้" className="x" onClick={() => removeImage(i)}>
                    ✕
                  </button>
                  <button title="เลื่อนขวา" onClick={() => moveImage(i, 1)}>
                    ›
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="proj-img-empty">ยังไม่มีรูป</span>
        )}
        <label className="btn-mini upload">
          {busy === 'uploading' ? 'กำลังอัปโหลด...' : '+ เพิ่มรูป (เลือกหลายรูปได้)'}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        {err && <p className="form-msg error">อัปโหลดไม่สำเร็จ: {err}</p>}
      </div>

      <div className="proj-fields">
        <input
          className="proj-title"
          value={p.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="ชื่อผลงาน"
        />
        <textarea
          value={p.description}
          rows={2}
          onChange={(e) => set('description', e.target.value)}
          placeholder="รายละเอียด"
        />
        <input
          value={p.tags.join(', ')}
          onChange={(e) =>
            set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))
          }
          placeholder="แท็ก คั่นด้วย ,"
        />
        <input
          value={p.link}
          onChange={(e) => set('link', e.target.value)}
          placeholder="ลิงก์เว็บ/เดโม (ถ้ามี) https://..."
        />
        <input
          value={p.gitLink}
          onChange={(e) => set('gitLink', e.target.value)}
          placeholder="ลิงก์ GitHub (ถ้ามี) https://github.com/..."
        />
        <div className="proj-actions">
          <button className="btn-mini" onClick={save}>
            {busy === 'saving' ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
          <button className="btn-mini danger" onClick={remove}>
            ลบ
          </button>
        </div>
      </div>
    </div>
  )
}
