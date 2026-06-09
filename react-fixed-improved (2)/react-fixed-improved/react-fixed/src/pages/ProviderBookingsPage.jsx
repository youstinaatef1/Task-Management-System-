import { useState, useEffect } from 'react'
import { getProviderBookings, changeBookingStatus } from '../services/api'

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await getProviderBookings()
        setBookings(res.data.data || res.data)
      } catch (err) {
        setError('Failed to load bookings.')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  async function handleStatusChange(bookingId, newStatus) {
    try {
      await changeBookingStatus(bookingId, newStatus)
      setBookings(bookings.map(b =>
        b._id === bookingId ? { ...b, status: newStatus } : b
      ))
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update')
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
      <h2 className="page-title">My Clients Bookings</h2>

      {error && <div className="error-msg">{error}</div>}

      {!error && bookings.length === 0 && (
        <div className="card center">
          <p>No bookings yet from clients.</p>
        </div>
      )}

      {bookings.map((booking) => (
        <div className="card" key={booking._id}>

          {/* معلومات الحجز */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>👤 {booking.userId?.userName || 'Client'}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                📧 {booking.userId?.email}
              </p>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
                📅 {new Date(booking.date).toLocaleDateString()} &nbsp; 🕐 {booking.time}
              </p>
            </div>
            <span className={getBadgeClass(booking.status)}>{booking.status}</span>
          </div>

          {/* أزرار التغيير */}
          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>

              {booking.status === 'pending' && (
                <button className="btn btn-primary"
                  onClick={() => handleStatusChange(booking._id, 'confirmed')}>
                  ✅ Confirm
                </button>
              )}

              {booking.status === 'confirmed' && (
                <button className="btn btn-success"
                  onClick={() => handleStatusChange(booking._id, 'completed')}>
                  🏁 Mark as Completed
                </button>
              )}

              <button className="btn btn-danger"
                onClick={() => handleStatusChange(booking._id, 'cancelled')}>
                ❌ Cancel
              </button>

            </div>
          )}

        </div>
      ))}
    </div>
  )
}