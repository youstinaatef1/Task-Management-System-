import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerProvider } from '../services/api'

export default function ProviderRegisterPage() {
  const navigate = useNavigate()

  const [name,         setName]         = useState('')
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [price,        setPrice]        = useState('')
  const [completedJobs,setCompletedJobs]= useState('')
  const [experience,   setExperience]   = useState('')
  const [image,        setImage]        = useState(null)  // الصورة

  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    // لازم نبعت FormData عشان فيه صورة
    const formData = new FormData()
    formData.append('name',          name)
    formData.append('email',         email)
    formData.append('password',      password)
    formData.append('price',         price)
    formData.append('completedJobs', completedJobs)
    formData.append('experience',    experience)
    formData.append('image',         image)  // الصورة

    try {
      await registerProvider(formData)
      setSuccess('Provider account created! Go to login.')
      setTimeout(() => navigate('/provider/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card" style={{ marginTop: '40px' }}>

        <h2 className="page-title">Register as Provider</h2>

        {error   && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name}
              onChange={(e) => setName(e.target.value)} required />
          </div>

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

          <div className="form-group">
            <label>Price per Job ($)</label>
            <input type="number" value={price}
              onChange={(e) => setPrice(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Completed Jobs</label>
            <input type="number" value={completedJobs}
              onChange={(e) => setCompletedJobs(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Experience (optional)</label>
            <input type="text" value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 5 years in plumbing" />
          </div>

          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" accept="image/*"
              onChange={(e) => setImage(e.target.files[0])} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Register
          </button>

        </form>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          Already have an account? <Link to="/provider/login" style={{ color: '#0284c7' }}>Login</Link>
        </p>

      </div>
    </div>
  )
}
