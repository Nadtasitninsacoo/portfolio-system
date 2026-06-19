import { useState, type FormEvent } from 'react'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('ส่งข้อความไม่สำเร็จ')
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        ชื่อ
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="ชื่อของคุณ"
        />
      </label>
      <label>
        อีเมล
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="email@example.com"
        />
      </label>
      <label>
        ข้อความ
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="รายละเอียดงานที่ต้องการ..."
        />
      </label>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === 'sending'}
        data-track="ปุ่ม: ส่งข้อความติดต่อ"
      >
        {status === 'sending' ? 'กำลังส่ง...' : 'ส่งข้อความ'}
      </button>
      {status === 'success' && (
        <p className="form-msg success">ส่งข้อความเรียบร้อยแล้ว ขอบคุณครับ 🙏</p>
      )}
      {status === 'error' && <p className="form-msg error">{error}</p>}
    </form>
  )
}
