import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, auth } from '../api/client'
import { MatrixRain } from '../components/MatrixRain'
import './admin.css'

export function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { token } = await api<{ token: string }>('/auth/login', {
        method: 'POST',
        body: { username, password },
      })
      auth.set(token)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login">
      <MatrixRain />
      <form className="login-card" onSubmit={submit}>
        <a className="login-back" href="/">
          ← กลับหน้าหลัก
        </a>
        <h1>เข้าสู่ระบบแอดมิน</h1>
        <p className="login-sub">จัดการข้อมูลโปรไฟล์ ผลงาน และข้อความ</p>
        <label>
          ชื่อผู้ใช้
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            autoFocus
          />
        </label>
        <label>
          รหัสผ่าน
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
        {error && <p className="form-msg error">{error}</p>}
      </form>
    </div>
  )
}
