import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ width:380 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:28, fontWeight:600, color:'var(--text)', letterSpacing:'-1px', marginBottom:6 }}>
            Bot<span style={{ color:'var(--green)' }}>.</span>kz
          </div>
          <div style={{ fontSize:13, color:'var(--text2)' }}>Создайте аккаунт бесплатно</div>
        </div>

        <div className="card">
          <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontSize:12, color:'var(--text2)', display:'block', marginBottom:6 }}>Имя</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" required />
            </div>
            <div>
              <label style={{ fontSize:12, color:'var(--text2)', display:'block', marginBottom:6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label style={{ fontSize:12, color:'var(--text2)', display:'block', marginBottom:6 }}>Пароль</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 8 символов" minLength={8} required />
            </div>
            {error && <div style={{ fontSize:12, color:'var(--red)', padding:'8px 12px', background:'var(--red-bg)', borderRadius:'var(--radius)' }}>{error}</div>}
            <button type="submit" className="btn btn-green" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'10px' }}>
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>

        <div style={{ textAlign:'center', marginTop:16, fontSize:13, color:'var(--text2)' }}>
          Уже есть аккаунт? <Link to="/login" style={{ color:'var(--green)', textDecoration:'none' }}>Войти</Link>
        </div>
      </div>
    </div>
  )
}
