import { createContext, useContext, useState } from 'react'

// 1) إنشاء الـ Context
const AuthContext = createContext()

// 2) الـ Provider اللي بيلف الـ App كلها
export function AuthProvider({ children }) {

  // بنقرأ الـ token من localStorage لو موجود
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const role  = localStorage.getItem('role')
    if (token) return { token, role }
    return null
  })

  // دالة Login: بتحفظ الـ token وبتعمل setState
  function login(token, role) {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    setUser({ token, role })
  }

  // دالة Logout: بتمسح كل حاجة
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3) Custom Hook عشان نستخدم الـ context بسهولة
export function useAuth() {
  return useContext(AuthContext)
}
