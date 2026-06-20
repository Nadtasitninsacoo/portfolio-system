import { useEffect, useRef, useState } from 'react'
import { api, uploadImage, assetUrl } from '../api/client'
import type { SiteProfile } from '../api/types'
import { defaultProfile } from '../data/profile'
import { calcAge } from '../utils/age'

export function ProfilePanel() {
  const [p, setP] = useState<SiteProfile>(defaultProfile)
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState<null | 'avatar' | 'cover'>(null)
  const [uploadErr, setUploadErr] = useState('')

  useEffect(() => {
    api<Partial<SiteProfile>>('/profile')
      .then((data) => setP({ ...defaultProfile, ...data }))
      .catch(() => {})
  }, [])

  const set = <K extends keyof SiteProfile>(k: K, v: SiteProfile[K]) =>
    setP((prev) => ({ ...prev, [k]: v }))

  const save = async () => {
    setStatus('saving')
    try {
      await api('/profile', { method: 'PUT', body: p, authed: true })
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  const handleUpload = async (
    file: File | undefined,
    kind: 'avatar' | 'cover',
    field: 'avatarUrl' | 'coverUrl',
  ) => {
    if (!file) return
    setUploadErr('')
    setUploading(kind)
    try {
      const { url } = await uploadImage(file)
      set(field, url)
      // อัปรูปปกใหม่ → รีเซ็ตตำแหน่งกลับกึ่งกลาง
      if (kind === 'cover') set('coverPos', 50)
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : 'อัปโหลดรูปไม่สำเร็จ')
    } finally {
      setUploading(null)
    }
  }

  const onAvatar = (file?: File) => handleUpload(file, 'avatar', 'avatarUrl')
  const onCover = (file?: File) => handleUpload(file, 'cover', 'coverUrl')

  // ===== ลากปรับตำแหน่งรูปปกแบบ Facebook (ปรับแกนตั้ง 0-100%) =====
  const coverRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startY: number; startPos: number } | null>(null)

  const onCoverDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!p.coverUrl) return
    drag.current = { startY: e.clientY, startPos: p.coverPos ?? 50 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onCoverMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const h = coverRef.current?.offsetHeight || 130
    const dy = e.clientY - drag.current.startY
    // ลากลง = เห็นส่วนบนของรูปมากขึ้น (ตำแหน่งลดลง)
    const next = drag.current.startPos - (dy / h) * 100
    set('coverPos', Math.round(Math.max(0, Math.min(100, next))))
  }
  const onCoverUp = () => {
    drag.current = null
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>ข้อมูลโปรไฟล์</h2>
        <button className="btn btn-primary" onClick={save}>
          {status === 'saving' ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </div>
      {status === 'saved' && <p className="form-msg success">บันทึกแล้ว ✓</p>}
      {status === 'error' && <p className="form-msg error">บันทึกไม่สำเร็จ</p>}
      {uploadErr && <p className="form-msg error">อัปโหลดรูปไม่สำเร็จ: {uploadErr}</p>}

      <div className="cover-edit">
        <div
          ref={coverRef}
          className={`cover-prev${p.coverUrl ? ' has-img draggable' : ''}`}
          style={
            p.coverUrl
              ? {
                  backgroundImage: `url(${assetUrl(p.coverUrl)})`,
                  backgroundPosition: `center ${p.coverPos ?? 50}%`,
                }
              : undefined
          }
          onPointerDown={onCoverDown}
          onPointerMove={onCoverMove}
          onPointerUp={onCoverUp}
          onPointerCancel={onCoverUp}
        >
          {p.coverUrl ? (
            <span className="cover-hint">⇕ ลากเพื่อปรับตำแหน่งรูป</span>
          ) : (
            <span>ยังไม่มีรูปปก (แบนเนอร์บนสุด)</span>
          )}
        </div>
        <div className="cover-edit-bar">
          <label className="btn-mini upload">
            {uploading === 'cover' ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูปปก'}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={uploading !== null}
              onChange={(e) => onCover(e.target.files?.[0])}
            />
          </label>
          {p.coverUrl && (
            <>
              <button className="btn-mini ghost" onClick={() => set('coverPos', 50)}>
                จัดกึ่งกลาง
              </button>
              <button className="btn-mini danger" onClick={() => set('coverUrl', '')}>
                เอารูปปกออก
              </button>
            </>
          )}
        </div>
      </div>

      <div className="avatar-edit">
        <div className="avatar-prev">
          {p.avatarUrl ? (
            <img src={assetUrl(p.avatarUrl)} alt="รูปโปรไฟล์" />
          ) : (
            <span>ยังไม่มีรูป</span>
          )}
        </div>
        <div className="avatar-edit-side">
          <label className="btn-mini upload">
            {uploading === 'avatar' ? 'กำลังอัปโหลด...' : 'เปลี่ยนรูปโปรไฟล์'}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={uploading !== null}
              onChange={(e) => onAvatar(e.target.files?.[0])}
            />
          </label>
          {p.avatarUrl && (
            <button className="btn-mini danger" onClick={() => set('avatarUrl', '')}>
              เอารูปออก
            </button>
          )}
        </div>
      </div>

      <div className="grid-2">
        <Field label="ชื่อ-นามสกุล" v={p.name} on={(v) => set('name', v)} />
        <Field
          label="ชื่อเล่น (ป้ายมุมรูปโปรไฟล์)"
          v={p.nickname}
          on={(v) => set('nickname', v)}
        />
        <Field label="ตำแหน่ง" v={p.role} on={(v) => set('role', v)} />
        <Field label="อีเมล" v={p.email} on={(v) => set('email', v)} />
        <Field label="เบอร์โทร (สำหรับลิงก์)" v={p.phone} on={(v) => set('phone', v)} />
        <Field label="เบอร์โทร (แสดงผล)" v={p.phoneDisplay} on={(v) => set('phoneDisplay', v)} />
        <Field label="ที่อยู่/พื้นที่" v={p.location} on={(v) => set('location', v)} />
      </div>

      <div className="birth-row">
        <div className="fld">
          <span>วันเกิด (ไม่โชว์บนเว็บ — ส่งให้ Google เท่านั้น)</span>
          <BirthDateFields value={p.birthDate} onChange={(iso) => set('birthDate', iso)} />
        </div>
        <div className="age-box">
          <span className="age-box-label">อายุปัจจุบัน</span>
          <span className="age-box-value">
            {calcAge(p.birthDate) !== null ? `${calcAge(p.birthDate)} ปี` : '—'}
          </span>
        </div>
      </div>

      <label className="fld">
        คำค้นหา / ชื่ออื่นๆ สำหรับ Google (ไม่แสดงบนเว็บ)
        <textarea
          value={p.seoKeywords}
          rows={2}
          placeholder="เช่น ณัฐสิทธิ์ นินสะคู, Nadtasit Ninsacoo, โปรแกรมเมอร์รับงาน"
          onChange={(e) => set('seoKeywords', e.target.value)}
        />
      </label>
      <p className="muted hint">
        ใส่ชื่อไทย/อังกฤษ หรือคำที่อยากให้ค้นแล้วเจอ (คั่นด้วยจุลภาค ,) —
        ส่งให้ Google เท่านั้น ไม่โชว์บนหน้าเว็บ
      </p>

      <label className="fld">
        แท็กไลน์ (ข้อความสั้นใต้ชื่อ)
        <textarea value={p.tagline} rows={2} onChange={(e) => set('tagline', e.target.value)} />
      </label>

      <label className="fld">
        เกี่ยวกับฉัน (เว้นบรรทัดว่าง = ย่อหน้าใหม่)
        <textarea
          value={p.about.join('\n\n')}
          rows={5}
          onChange={(e) => set('about', e.target.value.split(/\n\n+/))}
        />
      </label>

      <label className="fld">
        ทักษะ (คั่นด้วยจุลภาค ,)
        <textarea
          value={p.skills.join(', ')}
          rows={2}
          onChange={(e) =>
            set('skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
          }
        />
      </label>

      <label className="check">
        <input
          type="checkbox"
          checked={p.availableForWork}
          onChange={(e) => set('availableForWork', e.target.checked)}
        />
        แสดงป้าย "เปิดรับงานอยู่ตอนนี้"
      </label>

      <h3 className="sub-h">ช่องทางโซเชียล</h3>
      {p.socials.map((s, i) => (
        <div key={i} className="row-2">
          <input
            value={s.label}
            placeholder="ชื่อ เช่น GitHub"
            onChange={(e) => {
              const next = [...p.socials]
              next[i] = { ...s, label: e.target.value }
              set('socials', next)
            }}
          />
          <input
            value={s.href}
            placeholder="https://..."
            onChange={(e) => {
              const next = [...p.socials]
              next[i] = { ...s, href: e.target.value }
              set('socials', next)
            }}
          />
          <button
            className="btn-mini danger"
            onClick={() => set('socials', p.socials.filter((_, j) => j !== i))}
          >
            ลบ
          </button>
        </div>
      ))}
      <button
        className="btn-mini"
        onClick={() => set('socials', [...p.socials, { label: '', href: '' }])}
      >
        + เพิ่มช่องทาง
      </button>

      <h3 className="sub-h">ประวัติการศึกษา</h3>
      <p className="muted hint">
        Google จะดึงข้อมูลนี้ไปแสดงเมื่อมีคนค้นหาชื่อคุณ (ผ่าน structured data)
      </p>
      {p.education.map((e, i) => (
        <div key={i} className="edu-row">
          <input
            value={e.school}
            placeholder="สถาบัน เช่น มหาวิทยาลัย..."
            onChange={(ev) => {
              const next = [...p.education]
              next[i] = { ...e, school: ev.target.value }
              set('education', next)
            }}
          />
          <input
            value={e.degree}
            placeholder="วุฒิ / สาขา เช่น ปริญญาตรี วิทยาการคอมพิวเตอร์"
            onChange={(ev) => {
              const next = [...p.education]
              next[i] = { ...e, degree: ev.target.value }
              set('education', next)
            }}
          />
          <input
            value={e.year}
            placeholder="ปี เช่น 2561 - 2565"
            onChange={(ev) => {
              const next = [...p.education]
              next[i] = { ...e, year: ev.target.value }
              set('education', next)
            }}
          />
          <button
            className="btn-mini danger"
            onClick={() => set('education', p.education.filter((_, j) => j !== i))}
          >
            ลบ
          </button>
        </div>
      ))}
      <button
        className="btn-mini"
        onClick={() =>
          set('education', [...p.education, { school: '', degree: '', year: '' }])
        }
      >
        + เพิ่มประวัติการศึกษา
      </button>

      <h3 className="sub-h">สถิติ / ตัวเลขเด่น (โชว์ใต้ส่วนหัว)</h3>
      <p className="muted hint">เช่น ตัวเลข "3+" คู่กับคำอธิบาย "ปีประสบการณ์"</p>
      {p.stats.map((s, i) => (
        <div key={i} className="row-2">
          <input
            value={s.value}
            placeholder="ตัวเลข เช่น 3+ หรือ 100%"
            onChange={(ev) => {
              const next = [...p.stats]
              next[i] = { ...s, value: ev.target.value }
              set('stats', next)
            }}
          />
          <input
            value={s.label}
            placeholder="คำอธิบาย เช่น ปีประสบการณ์"
            onChange={(ev) => {
              const next = [...p.stats]
              next[i] = { ...s, label: ev.target.value }
              set('stats', next)
            }}
          />
          <button
            className="btn-mini danger"
            onClick={() => set('stats', p.stats.filter((_, j) => j !== i))}
          >
            ลบ
          </button>
        </div>
      ))}
      <button
        className="btn-mini"
        onClick={() => set('stats', [...p.stats, { value: '', label: '' }])}
      >
        + เพิ่มสถิติ
      </button>
    </div>
  )
}

function Field({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return (
    <label className="fld">
      {label}
      <input value={v} onChange={(e) => on(e.target.value)} />
    </label>
  )
}

const TH_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

// แยกค่า ISO "YYYY-MM-DD" (ค.ศ.) เป็นวัน/เดือน/ปี(พ.ศ.) สำหรับ dropdown
function parseBirth(value: string) {
  const [yCE, m, d] = value ? value.split('-') : ['', '', '']
  return {
    day: d ? String(Number(d)) : '',
    month: m ? String(Number(m)) : '',
    yearBE: yCE ? String(Number(yCE) + 543) : '',
  }
}

// เลือกวันเกิดด้วย dropdown วัน/เดือน(ไทย)/ปี(พ.ศ.) — เก็บเป็น ISO ค.ศ. "YYYY-MM-DD"
function BirthDateFields({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  // เก็บค่าที่เลือกของแต่ละช่องไว้เอง เพื่อให้เลือกทีละช่องได้โดยไม่ถูกรีเซ็ต
  const [parts, setParts] = useState(() => parseBirth(value))

  // ซิงก์เมื่อมีค่าจริงเข้ามาจากภายนอก (เช่น โหลดจาก backend) — ไม่รีเซ็ตตอนค่าว่าง
  useEffect(() => {
    if (value) setParts(parseBirth(value))
  }, [value])

  const nowBE = new Date().getFullYear() + 543
  const years = Array.from({ length: 100 }, (_, i) => nowBE - i)

  const apply = (next: { day: string; month: string; yearBE: string }) => {
    setParts(next)
    if (next.day && next.month && next.yearBE) {
      const ce = Number(next.yearBE) - 543
      onChange(`${ce}-${next.month.padStart(2, '0')}-${next.day.padStart(2, '0')}`)
    } else {
      onChange('')
    }
  }

  return (
    <div className="birth-fields">
      <select
        value={parts.day}
        aria-label="วัน"
        onChange={(e) => apply({ ...parts, day: e.target.value })}
      >
        <option value="">วัน</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <select
        value={parts.month}
        aria-label="เดือน"
        onChange={(e) => apply({ ...parts, month: e.target.value })}
      >
        <option value="">เดือน</option>
        {TH_MONTHS.map((name, i) => (
          <option key={i} value={i + 1}>{name}</option>
        ))}
      </select>
      <select
        value={parts.yearBE}
        aria-label="ปี พ.ศ."
        onChange={(e) => apply({ ...parts, yearBE: e.target.value })}
      >
        <option value="">ปี (พ.ศ.)</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}
