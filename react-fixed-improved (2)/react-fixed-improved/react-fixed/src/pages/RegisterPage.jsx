import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api'

export default function RegisterPage() {
  const navigate = useNavigate()

  // State لكل حقل في الفورم
  const [userName, setUserName] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await registerUser({ userName, email, password })
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '450px' }}>
      <div className="card" style={{ marginTop: '40px' }}>

        <h2 className="page-title">Create Account</h2>

        {error   && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

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
              placeholder="Min 6 characters"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Register
          </button>

        </form>
<p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          No account? <Link to="/provider/register" style={{ color: '#0284c7' }}>Register as Provider</Link>
        </p>
        {/* <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#0284c7' }}>Login</Link>
        </p> */}

      </div>
    </div>
  )
}
