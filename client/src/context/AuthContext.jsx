import { createContext, useContext, useState, useEffect } from 'react'
import { userAPI } from '../services/api.js'

const AuthContext = createContext(null)

const STORAGE_KEY = 'myfood_user'
const TOKEN_KEY = 'myfood_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [user])

  // Signup using POST /api/v1/users
  const signup = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'client',
        image_url: userData.image_url || null,
      }
      const res = await userAPI.signup(payload)
      const currentUser = res.user || res.data || res
      const token = res.token || 'demo-jwt-token'

      localStorage.setItem(TOKEN_KEY, token)
      setUser(currentUser)
      return currentUser
    } catch (err) {
      setError(err.message || 'Signup failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Login using POST /api/v1/users/login
  const login = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await userAPI.login({ email, password })
      const currentUser = res.user || res.data || res
      const token = res.token || 'demo-jwt-token'

      localStorage.setItem(TOKEN_KEY, token)
      setUser(currentUser)
      return currentUser
    } catch (err) {
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update profile via PATCH /api/v1/users?id=
  const updateProfile = async (updatedFields) => {
    if (!user?.id) throw new Error('No user logged in')
    setLoading(true)
    setError(null)
    try {
      const res = await userAPI.update(user.id, updatedFields)
      const updatedUser = res.user || res.data || res || { ...user, ...updatedFields }
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      setError(err.message || 'Update failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete profile via DELETE /api/v1/users?id=
  const deleteAccount = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      await userAPI.delete(user.id)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        signup,
        updateProfile,
        deleteAccount,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
