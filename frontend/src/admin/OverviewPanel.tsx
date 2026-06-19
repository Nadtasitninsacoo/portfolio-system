import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Summary {
  totalViews: number
  totalClicks: number
  uniqueVisitors: number
  todayViews: number
  viewsByDay: { day: string; count: number }[]
  topClicks: { label: string; count: number }[]
}

export function OverviewPanel() {
  const [data, setData] = useState<Summary | null>(null)
  const [err, setErr] = useState('')

  const load = () => {
    setErr('')
    api<Summary>('/analytics/summary', { authed: true })
      .then(setData)
      .catch((e) => setErr(e instanceof Error ? e.message : 'โหลดข้อมูลไม่สำเร็จ'))
  }

  useEffect(load, [])

  return (
    <div className="panel ov">
      <div className="panel-head">
        <h2>ภาพรวมสถิติเว็บไซต์</h2>
        <button className="btn-mini" onClick={load}>
          รีเฟรช
        </button>
      </div>

      {err && <p className="form-msg error">{err}</p>}
      {!data && !err && <p className="muted">กำลังโหลด...</p>}

      {data && (
        <>
          <div className="ov-stats">
            <StatCard label="ผู้เข้าชม (ไม่ซ้ำ)" value={data.uniqueVisitors} icon="👤" />
            <StatCard label="ยอดเข้าชมทั้งหมด" value={data.totalViews} icon="👁️" />
            <StatCard label="วันนี้" value={data.todayViews} icon="⚡" />
            <StatCard label="คลิกทั้งหมด" value={data.totalClicks} icon="🖱️" />
          </div>

          <div className="ov-card">
            <h3 className="ov-h">ยอดเข้าชม 14 วันล่าสุด</h3>
            <LineChart data={data.viewsByDay} />
          </div>

          <div className="ov-card">
            <h3 className="ov-h">ผู้เข้าชมชอบกดตรงไหน (คลิกยอดนิยม)</h3>
            {data.topClicks.length ? (
              <BarList data={data.topClicks} />
            ) : (
              <p className="muted">ยังไม่มีข้อมูลการคลิก</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="ov-stat">
      <span className="ov-stat-icon">{icon}</span>
      <span className="ov-stat-value">{value.toLocaleString()}</span>
      <span className="ov-stat-label">{label}</span>
    </div>
  )
}

// กราฟเส้น/พื้นที่ (วาด SVG เอง) โทนเหลือง
function LineChart({ data }: { data: { day: string; count: number }[] }) {
  const W = 720
  const H = 220
  const PAD = { l: 32, r: 16, t: 16, b: 28 }
  const max = Math.max(1, ...data.map((d) => d.count))
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0
  const x = (i: number) => PAD.l + stepX * i
  const y = (v: number) => PAD.t + innerH - (v / max) * innerH

  const pts = data.map((d, i) => `${x(i)},${y(d.count)}`).join(' ')
  const area = `${PAD.l},${PAD.t + innerH} ${pts} ${x(data.length - 1)},${PAD.t + innerH}`

  return (
    <div className="ov-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="ov-line">
        <defs>
          <linearGradient id="ovFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* เส้นแนวนอนอ้างอิง */}
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={PAD.l}
            x2={W - PAD.r}
            y1={PAD.t + innerH * f}
            y2={PAD.t + innerH * f}
            className="ov-grid"
          />
        ))}
        <polygon points={area} fill="url(#ovFill)" />
        <polyline points={pts} className="ov-stroke" />
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.count)} r="3" className="ov-dot" />
        ))}
      </svg>
      <div className="ov-xaxis">
        {data.map((d, i) => (
          <span key={i}>{i % 2 === 0 ? d.day.slice(5) : ''}</span>
        ))}
      </div>
    </div>
  )
}

// กราฟแท่งแนวนอน
function BarList({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  return (
    <div className="ov-bars">
      {data.map((d) => (
        <div key={d.label} className="ov-bar-row">
          <span className="ov-bar-label" title={d.label}>
            {d.label}
          </span>
          <div className="ov-bar-track">
            <div className="ov-bar-fill" style={{ width: `${(d.count / max) * 100}%` }} />
          </div>
          <span className="ov-bar-count">{d.count}</span>
        </div>
      ))}
    </div>
  )
}
