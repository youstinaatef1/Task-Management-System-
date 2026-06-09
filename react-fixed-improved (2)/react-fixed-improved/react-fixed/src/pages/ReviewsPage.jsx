import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProviderReviews, addReview } from '../services/api'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function ReviewsPage() {
  const { providerId } = useParams()
  const { user }       = useAuth()
  const navigate       = useNavigate()

  const [provider, setProvider] = useState(null)
  const [reviews,  setReviews]  = useState([])
  const [rating,   setRating]   = useState(5)
  const [comment,  setComment]  = useState('')
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  // جيب بيانات الـ provider + reviews
  useEffect(() => {
    async function fetchData() {
      try {
        const [revRes, provRes] = await Promise.all([
          getProviderReviews(providerId),
          axios.get('/api/providers'),
        ])
        setReviews(revRes.data || [])
        const all  = provRes.data.data || provRes.data
        const prov = all.find((p) => p._id === providerId)
        setProvider(prov || null)
      } catch {
        setError('Failed to load data')
      }
    }
    fetchData()
  }, [providerId])

  async function handleAddReview(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const res = await addReview({ providerId, rating, comment })
      setReviews([res.data, ...reviews])
      setSuccess('Review added! ✅')
      setComment('')
      setRating(5)
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add review')
    }
  }

  // ── متوسط الـ rating ──
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="container" style={{ maxWidth: '680px' }}>

      {/* ── Provider Header ── */}
      {provider && (
        <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
          <img
            src={`/uploads/${provider.image?.split('uploads\\')[1] || provider.image?.split('uploads/')[1] || provider.image}`}
            alt={provider.name}
            onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=No+Img' }}
            style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e0f2fe' }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{provider.name}</h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0' }}>💰 ${provider.price}  •  ✅ {provider.completedJobs} jobs</p>
            {avg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>
                  {'★'.repeat(Math.floor(avg))}{'☆'.repeat(5 - Math.floor(avg))}
                </span>
                <span style={{ fontWeight: 700, color: '#f59e0b' }}>{avg}</span>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>({reviews.length} reviews)</span>
              </div>
            )}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate(user ? `/book/${providerId}` : '/login')}
          >
            📅 Book Now
          </button>
        </div>
      )}

      <h2 className="page-title">Reviews</h2>

      {/* ── Add Review Form ── */}
      {user ? (
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>Add Your Review</h3>

          {error   && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <form onSubmit={handleAddReview}>
            {/* Star picker */}
            <div className="form-group">
              <label>Rating</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    style={{
                      fontSize: '26px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: n <= rating ? '#f59e0b' : '#cbd5e1',
                      transition: 'color 0.15s',
                      padding: '0 2px',
                    }}
                  >★</button>
                ))}
                <span style={{ alignSelf: 'center', fontSize: '13px', color: '#64748b', marginLeft: '4px' }}>
                  {['', 'Terrible', 'Bad', 'Average', 'Good', 'Excellent'][rating]}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Comment</label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: '#64748b', marginBottom: '12px' }}>Login to add a review or book this provider</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      )}

      {/* ── Reviews List ── */}
      <div style={{ marginTop: '20px' }}>
        {reviews.length === 0 && (
          <div className="card center" style={{ color: '#94a3b8' }}>No reviews yet — be the first!</div>
        )}

        {reviews.map((review) => (
          <div className="card" key={review._id} style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '14px' }}>{review.user?.userName || 'User'}</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
              </div>
            </div>
            <p style={{ marginTop: '8px', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>{review.comment}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* ── Book CTA في الأسفل ── */}
      {reviews.length > 2 && (
        <div className="card" style={{ textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <p style={{ fontWeight: 700, marginBottom: '12px', color: '#1e40af' }}>
            Convinced? Book {provider?.name || 'this provider'} now!
          </p>
          <button
            className="btn btn-primary"
            style={{ padding: '11px 32px' }}
            onClick={() => navigate(user ? `/book/${providerId}` : '/login')}
          >
            📅 Book Now
          </button>
        </div>
      )}

    </div>
  )
}
