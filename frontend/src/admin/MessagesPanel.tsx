import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Message } from '../api/types'

export function MessagesPanel() {
  const [items, setItems] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    api<Message[]>('/messages', { authed: true })
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  const markRead = async (id: number) => {
    await api(`/messages/${id}/read`, { method: 'PATCH', authed: true })
    load()
  }
  const remove = async (id: number) => {
    if (!confirm('ลบข้อความนี้?')) return
    await api(`/messages/${id}`, { method: 'DELETE', authed: true })
    load()
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>ข้อความจากลูกค้า ({items.length})</h2>
      </div>

      {loading ? (
        <p className="muted">กำลังโหลด...</p>
      ) : items.length === 0 ? (
        <p className="muted">ยังไม่มีข้อความ</p>
      ) : (
        <div className="msg-list">
          {items.map((m) => (
            <div key={m.id} className={`msg${m.isRead ? '' : ' unread'}`}>
              <div className="msg-top">
                <strong>{m.name}</strong>
                <a href={`mailto:${m.email}`}>{m.email}</a>
                <span className="msg-date">{fmt(m.createdAt)}</span>
              </div>
              <p className="msg-body">{m.message}</p>
              <div className="msg-actions">
                {!m.isRead && (
                  <button className="btn-mini" onClick={() => markRead(m.id)}>
                    ทำเครื่องหมายว่าอ่านแล้ว
                  </button>
                )}
                <button className="btn-mini danger" onClick={() => remove(m.id)}>
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
