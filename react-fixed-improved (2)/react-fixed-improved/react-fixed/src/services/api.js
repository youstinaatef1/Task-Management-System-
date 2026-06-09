import axios from 'axios'

// كل الـ requests بتروح على /api
const api = axios.create({
  baseURL: '/api'
})

// قبل كل request، بنحط الـ token تلقائياً
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ======= User =======
export const registerUser = (data) => api.post('/users', data)
export const loginUser    = (data) => api.post('/logins', data)

// ======= Provider =======
export const registerProvider = (data) => api.post('/providers', data)  // بيستقبل FormData
export const loginProvider    = (data) => api.post('/loginProvider', data)
export const getAllProviders  = ()     => api.get('/providers')
export const getProviderBookings = () => api.get('/bookings/provider')
// ======= Reviews =======
export const addReview          = (data) => api.post('/reviews', data)
export const getProviderReviews = (id)   => api.get(`/providersReviews/${id}`)

// ======= Bookings =======
export const createBooking       = (data)       => api.post('/bookings', data)
export const getMyBookings       = ()            => api.get('/bookings')
export const changeBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status })
