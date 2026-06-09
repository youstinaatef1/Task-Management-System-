import { useState, useEffect } from 'react'
import axios from 'axios'
import { changeBookingStatus } from '../services/api'

// ─── API calls للـ admin ─────────────────────────────────────────────────────
// (بنستخدم axios مباشرة مع الـ token)
function adminApi() {
  return axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
}

const getAllBookings   = ()         => adminApi().get('/bookings/all')
const deleteProvider  = (id)       => adminApi().delete(`/providers/${id}`)
const updateProvider  = (id, data) => adminApi().patch(`/providers/${id}`, data)

// ─── الـ Status Badge ─────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    pending:   'badge badge-pending',
    confirmed: 'badge badge-confirmed',
    completed: 'badge badge-completed',
    cancelled: 'badge badge-cancelled',
  }
  return <span className={map[status] || 'badge'}>{status}</span>
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 24px',
        borderRadius: '10px',
        // border: 'none',
        fontFamily: 'inherit',
        fontWeight: 700,
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        background: active ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'white',
        color:      active ? 'white' : '#64748b',
        boxShadow:  active ? '0 2px 10px rgba(2,132,199,0.3)' : 'none',
        border:     active ? 'none' : '1.5px solid #e2e8f0',
      }}
    >
      {children}
    </button>
  )
}

// ════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [tab, setTab] = useState('bookings') // 'bookings' | 'providers'

  // ── Bookings state ──
  const [bookings,  setBookings]  = useState([])
  const [bLoading,  setBLoading]  = useState(true)
  const [bError,    setBError]    = useState('')

  // ── Providers state ──
  const [providers, setProviders] = useState([])
  const [pLoading,  setPLoading]  = useState(true)
  const [pError,    setPError]    = useState('')

  // ── Edit Provider modal ──
  const [editingProvider, setEditingProvider] = useState(null)  // الـ provider اللي بنعدله
  const [editName,  setEditName]  = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // ── Fetch كل الـ bookings ──
  // useEffect(() => {
  //   getAllBookings()
  //     .then((res) => setBookings(res.data.data || res.data))
  //     .catch(() => setBError('فشل تحميل الـ bookings — تأكد إن الـ endpoint /api/bookings/all موجود وبيقبل admin token'))
  //     .finally(() => setBLoading(false))
  // }, [])

  // // ── Fetch كل الـ providers ──
  // useEffect(() => {
  //   axios.get('/api/providers')
  //     .then((res) => setProviders(res.data.data || res.data))
  //     .catch(() => setPError('فشل تحميل الـ providers'))
  //     .finally(() => setPLoading(false))
  // }, [])
useEffect(() => {
  const token = localStorage.getItem('token')
  
  // ✅ تحقق إن الـ token موجود قبل ما تطلب
  if (!token) {
    setBError('لا يوجد token — يرجى تسجيل الدخول مرة أخرى')
    setBLoading(false)
    return
  }

  getAllBookings()
    .then((res) => {
      const data = res.data.data || res.data
      setBookings(Array.isArray(data) ? data : [])
    })
    .catch((err) => {
      console.error('Bookings fetch error:', err.response?.data)
      if (err.response?.status === 403) {
        setBError('ليس لديك صلاحية admin')
      } else if (err.response?.status === 500) {
        setBError('خطأ في السيرفر — تحقق من الـ backend console')
      } else {
        setBError('فشل تحميل الـ bookings')
      }
    })
    .finally(() => setBLoading(false))
}, [])
  // ── تغيير status الـ booking ──
  async function handleStatusChange(bookingId, newStatus) {
    try {
      await changeBookingStatus(bookingId, newStatus)
      setBookings(bookings.map(b =>
        b._id === bookingId ? { ...b, status: newStatus } : b
      ))
    } catch {
      alert('فشل تغيير الـ status')
    }
  }

  // ── حذف provider ──
  async function handleDeleteProvider(id) {
    if (!window.confirm('مؤكد تحذف الـ provider ده؟')) return
    try {
      await deleteProvider(id)
      setProviders(providers.filter(p => p._id !== id))
    } catch {
      alert('فشل الحذف — تأكد إن الـ endpoint موجود في الـ backend')
    }
  }

  // ── فتح modal التعديل ──
  function openEdit(provider) {
    setEditingProvider(provider)
    setEditName(provider.name)
    setEditPrice(provider.price)
  }

  // ── حفظ التعديل ──
  async function handleSaveEdit() {
    setEditSaving(true)
    try {
      await updateProvider(editingProvider._id, { name: editName, price: editPrice })
      setProviders(providers.map(p =>
        p._id === editingProvider._id ? { ...p, name: editName, price: editPrice } : p
      ))
      setEditingProvider(null)
    } catch {
      alert('فشل التعديل — تأكد إن الـ endpoint موجود في الـ backend')
    } finally {
      setEditSaving(false)
    }
  }

  // ── Stats ──
  const totalBookings   = bookings.length
  const pendingCount    = bookings.filter(b => b.status === 'pending').length
  const completedCount  = bookings.filter(b => b.status === 'completed').length
  const cancelledCount  = bookings.filter(b => b.status === 'cancelled').length

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>

      <h2 className="page-title">🛡️ Admin Dashboard</h2>

      {/* ─── Stats Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Bookings', value: totalBookings,  color: '#0284c7', bg: '#eff6ff' },
          { label: 'Pending',        value: pendingCount,   color: '#92400e', bg: '#fef9c3' },
          { label: 'Completed',      value: completedCount, color: '#15803d', bg: '#dcfce7' },
          { label: 'Cancelled',      value: cancelledCount, color: '#b91c1b', bg: '#fee2e2' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ background: s.bg, border: 'none', textAlign: 'center', padding: '20px 12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: s.color, fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── Tabs ─── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TabBtn active={tab === 'bookings'}  onClick={() => setTab('bookings')}>📅 All Bookings</TabBtn>
        <TabBtn active={tab === 'providers'} onClick={() => setTab('providers')}>👷 Manage Providers</TabBtn>
      </div>

      {/* ════════ TAB: Bookings ════════ */}
      {tab === 'bookings' && (
        <>
          {bLoading && <p style={{ color: '#64748b' }}>⏳ Loading bookings...</p>}
          {bError   && <div className="error-msg">{bError}</div>}

          {!bLoading && !bError && bookings.length === 0 && (
            <div className="card center"><p>لا توجد bookings حتى الآن.</p></div>
          )}

          {bookings.map((b) => (
            <div className="card" key={b._id} style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>

                <div>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
                    👤 {b.userId?.userName || b.userId?.email || 'User'}
                    <span style={{ color: '#94a3b8', fontWeight: 400 }}> → </span>
                    🔧 {b.providerId?.name || 'Provider'}
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    📅 {new Date(b.date).toLocaleDateString()}  &nbsp;|&nbsp;  🕐 {b.time}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <Badge status={b.status} />

                  {/* تغيير الـ status */}
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '2px solid #e2e8f0',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: 'white',
                    }}
                  >
                    {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          ))}
        </>
      )}

      {/* ════════ TAB: Providers ════════ */}
      {tab === 'providers' && (
        <>
          {pLoading && <p style={{ color: '#64748b' }}>⏳ Loading providers...</p>}
          {pError   && <div className="error-msg">{pError}</div>}

          {!pLoading && !pError && providers.length === 0 && (
            <div className="card center"><p>لا يوجد providers.</p></div>
          )}

          {providers.map((p) => (
            <div className="provider-card" key={p._id}>
              <img
                src={`/uploads/${p.image?.split('uploads\\')[1] || p.image?.split('uploads/')[1] || p.image}`}
                alt={p.name}
                onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=No+Img' }}
              />

              <div className="provider-info" style={{ flex: 1 }}>
                <h3>{p.name}</h3>
                <p>📧 {p.email}</p>
                <p>💰 Price: ${p.price}</p>
                <p>✅ Completed Jobs: {p.completedJobs}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-primary" onClick={() => openEdit(p)}>✏️ Edit</button>
                <button className="btn btn-danger"  onClick={() => handleDeleteProvider(p._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ─── Edit Provider Modal ─── */}
      {editingProvider && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999,
        }}>
          <div className="card" style={{ width: '380px', margin: 0 }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 800, color: '#0284c7' }}>
              ✏️ Edit Provider
            </h3>

            <div className="form-group">
              <label>Name</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleSaveEdit}
                disabled={editSaving}
              >
                {editSaving ? 'Saving...' : 'Save ✅'}
              </button>
              <button
                className="btn"
                style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: '1.5px solid #e2e8f0' }}
                onClick={() => setEditingProvider(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
