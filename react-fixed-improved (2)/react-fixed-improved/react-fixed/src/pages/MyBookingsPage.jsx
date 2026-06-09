import { useState, useEffect } from 'react'
import { getMyBookings, changeBookingStatus } from '../services/api'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await getMyBookings()
        const list = res.data.data || res.data
        setBookings(list)
      } catch (err) {
        setError('Failed to load bookings.')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  async function handleCancel(bookingId) {
    try {
      await changeBookingStatus(bookingId, 'cancelled')
      // غير الـ status في الصفحة مباشرة
      setBookings(bookings.map(b =>
        b._id === bookingId ? { ...b, status: 'cancelled' } : b
      ))
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to cancel')
    }
  }

  function getBadgeClass(status) {
    if (status === 'pending')   return 'badge badge-pending'
    if (status === 'confirmed') return 'badge badge-confirmed'
    if (status === 'completed') return 'badge badge-completed'
    if (status === 'cancelled') return 'badge badge-cancelled'
    return 'badge'
  }

  if (loading) return <div className="container"><p style={{marginTop:'30px'}}>⏳ Loading...</p></div>

  return (
    <div className="container">
      <h2 className="page-title">My Bookings</h2>

      {error && <div className="error-msg">{error}</div>}

      {!error && bookings.length === 0 && (
        <div className="card center">
          <p>No bookings yet. <a href="/providers" style={{color:'#0284c7'}}>Book someone!</a></p>
        </div>
      )}

      {bookings.map((booking) => (
        <div className="card" key={booking._id}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>👤 {booking.providerId?.name || 'Provider'}</h3>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                📅 Date: {new Date(booking.date).toLocaleDateString()}
              </p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                🕐 Time: {booking.time}
              </p>
            </div>
            <span className={getBadgeClass(booking.status)}>{booking.status}</span>
          </div>

          {/* ✅ زرار Cancel — بيظهر دايما للـ user لو مش cancelled أو completed */}
          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <div style={{ marginTop: '12px' }}>
              <button
                className="btn btn-danger"
                onClick={() => handleCancel(booking._id)}
              >
                ❌ Cancel Booking
              </button>
            </div>
          )}

        </div>
      ))}
    </div>
  )
}