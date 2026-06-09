import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Navbar               from './pages/Navbar'
import HomePage             from './pages/HomePage'
import RegisterPage         from './pages/RegisterPage'
import LoginPage            from './pages/LoginPage'
import ProviderRegisterPage from './pages/ProviderRegisterPage'
import ProviderLoginPage    from './pages/ProviderLoginPage'
import ProvidersPage        from './pages/ProvidersPage'
import BookingPage          from './pages/BookingPage'
import MyBookingsPage       from './pages/MyBookingsPage'
import ReviewsPage          from './pages/ReviewsPage'
import ProviderBookingsPage from './pages/ProviderBookingsPage'
import AdminDashboard       from './pages/AdminDashboard'

// صفحة محمية - لو مش logged in تروح للـ login
function PrivateRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return children
}

// صفحة للـ admin بس - لو مش admin تروح للـ home
function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'admin') return <Navigate to="/" />
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>

          {/* صفحات عامة */}
          <Route path="/"                    element={<HomePage />} />
          <Route path="/register"            element={<RegisterPage />} />
          <Route path="/login"               element={<LoginPage />} />
          <Route path="/provider/register"   element={<ProviderRegisterPage />} />
          <Route path="/provider/login"      element={<ProviderLoginPage />} />
          <Route path="/providers"           element={<ProvidersPage />} />
          <Route path="/reviews/:providerId" element={<ReviewsPage />} />

          {/* صفحات محمية - لازم تكون logged in */}
          <Route path="/book/:providerId" element={
            <PrivateRoute><BookingPage /></PrivateRoute>
          } />
          <Route path="/my-bookings" element={
            <PrivateRoute><MyBookingsPage /></PrivateRoute>
          } />
          <Route path="/provider/bookings" element={
            <PrivateRoute><ProviderBookingsPage /></PrivateRoute>
          } />

          {/* صفحة الـ admin بس */}
          <Route path="/admin/dashboard" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
