import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="container">

      {/* Hero Section */}
      <div className="card center" style={{ padding: '50px', marginTop: '30px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '15px', color: '#0284c7' }}>
          Welcome to BookingApp 👋
        </h1>
        <img style={{width: '100%'}} src="https://images.pexels.com/photos/6195951/pexels-photo-6195951.jpeg" alt="" />
        <p style={{ fontSize: '17px', color: '#d3734a', marginBottom: '25px' }}>
          Find the best service providers and book appointments easily.
        </p>
        <Link to="/providers" className="btn btn-primary" style={{ marginRight: '10px', background: '#FF8B5A'}}>
          Browse Providers
        </Link>
        <Link to="/register" className="btn" style={{ background: '#FFD45A', color: '#FF5A5A' }}>
          Create Account
        </Link>
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div className="card center">
          <div style={{ fontSize: '40px' }}>🔍</div>
          <h3>Find Experts</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Browse verified providers</p>
        </div>
        <div className="card center">
          <div style={{ fontSize: '40px' }}>📅</div>
          <h3>Easy Booking</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Book in seconds</p>
        </div>
        <div className="card center">
          <div style={{ fontSize: '40px' }}>⭐</div>
          <h3>Reviews</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Real customer reviews</p>
        </div>
      </div>

    </div>
  )
}
