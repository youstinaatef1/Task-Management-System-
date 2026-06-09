import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createBooking } from '../services/api'

export default function BookingPage() {
  // بناخد الـ providerId من الـ URL
  const { providerId } = useParams()
  const navigate       = useNavigate()

  const [date,    setDate]    = useState('')
  const [time,    setTime]    = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await createBooking({ providerId, date, time })
      setSuccess('Booking created successfully! 🎉')
      setTimeout(() => navigate('/my-bookings'), 1500)
    } catch (err) {
      setError(err.response?.data?.msg || 'Booking failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '450px' }}>
      <div className="card" style={{ marginTop: '40px' }}>

        <h2 className="page-title">Book Appointment</h2>

        {error   && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Confirm Booking
          </button>

        </form>

      </div>
    </div>
  )
}
