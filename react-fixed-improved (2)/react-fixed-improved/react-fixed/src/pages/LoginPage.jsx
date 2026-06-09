import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [role,     setRole]     = useState('user')   // user أو admin
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const res = await loginUser({ email, password, role })

      // الـ backend المفروض يرجع role في الـ response
      // لو مش بيرجعها، بناخد اللي اختاره اليوزر كـ fallback
      const returnedRole = res.data.role || res.data.user?.role || role

      login(res.data.token, returnedRole)

      // كل role يروح على صفحة مختلفة
      if (returnedRole === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '450px' }}>
      <div className="card" style={{ marginTop: '40px' }}>

        <h2 className="page-title">Login</h2>

        {error && <div className="error-msg">{error}</div>}

        {/* Role Selector */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
          {['user', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: `2px solid ${role === r ? '#0284c7' : '#e2e8f0'}`,
                background: role === r ? '#eff6ff' : 'white',
                color: role === r ? '#0284c7' : '#64748b',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              {r === 'user' ? '👤 User' : '🛡️ Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login as {role === 'admin' ? 'Admin 🛡️' : 'User 👤'}
          </button>

        </form>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          No account? <Link to="/register" style={{ color: '#0284c7' }}>Register</Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px' }}>
          Are you a provider? <Link to="/provider/login" style={{ color: '#0284c7' }}>Provider Login</Link>
        </p>

      </div>
    </div>
  )
}
