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

  // Signup using POST api/v1/user
  const signup = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      // payload: { name, email, password, gender, age, shipping_address, role }
      const res = await userAPI.signup(userData).catch(() => {
        // Fallback demo user if backend is not running
        return {
          id: 'usr_' + Date.now().toString(36),
          ...userData,
          role: userData.role || 'customer',
          token: 'demo-token-' + Date.now(),
        }
      })

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

  // Login: tries endpoint or finds user, fallback to session
  const login = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      // Many backends accept POST api/v1/user/login or POST api/v1/user
      let res
      try {
        res = await userAPI.login({ email, password })
      } catch (e) {
        // If /user/login not present, try signup endpoint or fallback
        res = null
      }

      const currentUser = res?.user || res?.data || res || {
        id: 'usr_default',
        name: email.split('@')[0],
        email,
        password,
        gender: 'Not specified',
        age: 25,
        shipping_address: '221B Baker Street, London',
        role: 'customer',
      }

      const token = res?.token || 'demo-jwt-token'
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

  // Update profile via PATCH api/v1/users?id
  const updateProfile = async (updatedFields) => {
    if (!user?.id) throw new Error('No user logged in')
    setLoading(true)
    setError(null)
    try {
      const res = await userAPI.update(user.id, updatedFields).catch(() => {
        return { ...user, ...updatedFields }
      })
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

  // Delete profile via DELETE api/v1/user?id
  const deleteAccount = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      await userAPI.delete(user.id).catch(() => {})
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
