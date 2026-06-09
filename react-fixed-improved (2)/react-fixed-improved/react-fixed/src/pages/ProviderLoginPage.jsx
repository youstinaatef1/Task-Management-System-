import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginProvider } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ProviderLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const res = await loginProvider({ email, password })
      login(res.data.token, 'provider')  // role = 'provider'
      navigate('/providers')
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '450px' }}>
      <div className="card" style={{ marginTop: '40px' }}>

        <h2 className="page-title">Provider Login</h2>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>

        </form>
<p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#0284c7' }}>Login</Link>
        </p>
        {/* <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          No account? <Link to="/provider/register" style={{ color: '#0284c7' }}>Register as Provider</Link>
        </p> */}

      </div>
    </div>
  )
}
