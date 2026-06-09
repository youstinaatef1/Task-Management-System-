import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { getProviderReviews } from '../services/api'

// ── حساب متوسط الـ rating ─────────────────────────────────────────────────────
function avgRating(reviews) {
  if (!reviews || reviews.length === 0) return null
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return (sum / reviews.length).toFixed(1)
}

// ── عرض النجوم ────────────────────────────────────────────────────────────────
function StarDisplay({ rating, count }) {
  if (rating === null) return (
    <span style={{ fontSize: '13px', color: '#94a3b8' }}>No reviews yet</span>
  )
  const full  = Math.floor(rating)
  const empty = 5 - full
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ color: '#f59e0b', fontSize: '15px' }}>
        {'★'.repeat(full)}{'☆'.repeat(empty)}
      </span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>{rating}</span>
      <span style={{ fontSize: '12px', color: '#94a3b8' }}>({count})</span>
    </span>
  )
}

// ── بطاقة Review مصغرة ────────────────────────────────────────────────────────
function ReviewPreview({ reviews }) {
  if (!reviews || reviews.length === 0) return null
  // أحسن review (أعلى rating)
  const best = [...reviews].sort((a, b) => b.rating - a.rating)[0]
  return (
    <div style={{
      background: '#f8faff',
      border: '1px solid #e0eaff',
      borderRadius: '8px',
      padding: '8px 12px',
      marginTop: '8px',
      fontSize: '13px',
    }}>
      <span style={{ color: '#f59e0b' }}>{'★'.repeat(best.rating)}</span>
      <span style={{ color: '#475569', marginLeft: '6px', fontStyle: 'italic' }}>
        "{best.comment}"
      </span>
      <span style={{ color: '#94a3b8', marginLeft: '6px' }}>
        — {best.user?.userName || 'User'}
      </span>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
export default function ProvidersPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [providers,      setProviders]      = useState([])
  const [reviewsMap,     setReviewsMap]     = useState({})  // { providerId: [reviews] }
  const [search,         setSearch]         = useState('')
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState('')
  const [expandedId,     setExpandedId]     = useState(null) // id الـ provider اللي مفتوح reviews

  // ── جيب الـ providers ──
  useEffect(() => {
    async function fetchProviders() {
      try {
        const res  = await axios.get('/api/providers')
        const list = res.data.data || res.data
        setProviders(list)

        // جيب reviews كل provider بعد ما تجيب الـ providers
        const entries = await Promise.allSettled(
          list.map(async (p) => {
            const r = await getProviderReviews(p._id)
            return [p._id, r.data || []]
          })
        )
        const map = {}
        entries.forEach((e) => {
          if (e.status === 'fulfilled') map[e.value[0]] = e.value[1]
        })
        setReviewsMap(map)
      } catch {
        setError('Failed to load providers.')
      } finally {
        setLoading(false)
      }
    }
    fetchProviders()
  }, [])

  const filtered = providers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="container"><p style={{ marginTop: '30px' }}>⏳ Loading providers...</p></div>

  return (
    <div className="container">
      <h2 className="page-title">Service Providers</h2>

      <div className="form-group" style={{ maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="error-msg">{error}</div>}

      {!error && filtered.length === 0 && (
        <div className="card center">
          <p>No providers found. Register some providers first.</p>
        </div>
      )}

      {filtered.map((provider) => {
        const reviews   = reviewsMap[provider._id] || []
        const rating    = avgRating(reviews)
        const isExpanded = expandedId === provider._id

        return (
          <div key={provider._id} style={{ marginBottom: '16px' }}>

            {/* ── Provider Card ── */}
            <div className="provider-card" style={{ marginBottom: 0, borderRadius: isExpanded ? '16px 16px 0 0' : '16px' }}>
              <img
                src={`/uploads/${provider.image?.split('uploads\\')[1] || provider.image?.split('uploads/')[1] || provider.image}`}
                alt={provider.name}
                onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=No+Img' }}
              />

              <div className="provider-info" style={{ flex: 1 }}>
                <h3>{provider.name}</h3>
                <p>📧 {provider.email}</p>
                <p>💰 Price: ${provider.price}</p>
                <p>✅ Completed Jobs: {provider.completedJobs}</p>
                {provider.experience && <p>🛠 Experience: {provider.experience}</p>}

                {/* ── Rating inline ── */}
                <div style={{ marginTop: '8px' }}>
                  <StarDisplay rating={rating} count={reviews.length} />
                </div>

                {/* ── أحسن review preview ── */}
                <ReviewPreview reviews={reviews} />
              </div>

              {/* ── الأزرار ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                {user ? (
                  <button className="btn btn-primary" onClick={() => navigate(`/book/${provider._id}`)}>
                    📅 Book Now
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Login to Book
                  </button>
                )}

                <button
                  className="btn"
                  style={{
                    background: isExpanded ? '#0284c7' : '#f0f9ff',
                    color:      isExpanded ? 'white'   : '#0284c7',
                    border: '1.5px solid #0284c7',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : provider._id)}
                >
                  {isExpanded ? 'Hide Reviews' : `Reviews ⭐ ${reviews.length > 0 ? `(${reviews.length})` : ''}`}
                </button>
              </div>
            </div>

            {/* ── Reviews Expandable Panel ── */}
            {isExpanded && (
              <div style={{
                background: 'white',
                border: '1px solid #e8f0fe',
                borderTop: 'none',
                borderRadius: '0 0 16px 16px',
                padding: '16px 24px 20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>
                    All Reviews
                  </p>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '7px 16px', fontSize: '13px' }}
                    onClick={() => navigate(user ? `/book/${provider._id}` : '/login')}
                  >
                    📅 Book {provider.name}
                  </button>
                </div>

                {reviews.length === 0 && (
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>No reviews yet — be the first!</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {reviews.map((review) => (
                    <div key={review._id} style={{
                      background: '#f8faff',
                      border: '1px solid #e0eaff',
                      borderRadius: '10px',
                      padding: '12px 16px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '14px' }}>{review.user?.userName || 'User'}</strong>
                        <span style={{ color: '#f59e0b', fontSize: '15px' }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p style={{ marginTop: '6px', color: '#475569', fontSize: '14px' }}>{review.comment}</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* زرار Book في الأسفل */}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '11px 32px' }}
                    onClick={() => navigate(user ? `/book/${provider._id}` : '/login')}
                  >
                    📅 Book {provider.name} Now
                  </button>
                </div>
              </div>
            )}

          </div>
        )
      })}
    </div>
  )
}
