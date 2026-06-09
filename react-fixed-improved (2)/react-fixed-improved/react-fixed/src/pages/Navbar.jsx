import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="navbar">
      <h2>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          BookingApp
        </Link>
      </h2>

      <div>
        {/* لو مش logged in */}
        {!user && (
          <>
            <Link to="/providers">Providers</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {/* Admin */}
        {user && user.role === 'admin' && (
          <>
            <Link to="/admin/dashboard">🛡️ Dashboard</Link>
            <Link to="/providers">Providers</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* Provider */}
        {user && user.role === 'provider' && (
          <>
            <Link to="/provider/bookings">My Clients</Link>
            <Link to="/providers">Providers</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* User */}
        {user && user.role === 'user' && (
          <>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/providers">Providers</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  )
}
