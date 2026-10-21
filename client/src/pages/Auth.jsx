import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [localError, setLocalError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (localError) setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.email.trim() || !formData.password) {
      setLocalError('Email and password are required.')
      return
    }

    if (isSignUp && !formData.name.trim()) {
      setLocalError('Full name is required to create an account.')
      return
    }

    setSubmitting(true)
    try {
      if (isSignUp) {
        // Schema for POST /api/v1/user: { name, email, password, role: 'client' }
        await signup({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: 'client',
        })
      } else {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        })
      }
      navigate(from, { replace: true })
    } catch (err) {
      setLocalError(err.message || 'Authentication error. Please verify your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Branded Left Hero */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <Link to="/" className="auth-logo">My Food</Link>
          <div className="auth-hero-text">
            <span className="pill auth-pill">Fast & Fresh Gourmet</span>
            <h1>Flavors crafted for your doorstep</h1>
            <p>
              Join thousands of food lovers enjoying chef-crafted meals, authentic farm ingredients,
              and 30-minute delivery tracking.
            </p>
          </div>
          <div className="auth-footer-tag">
            <span>Freshly prepared everyday</span>
            <span className="dot-sep">•</span>
            <span>Zero preservatives</span>
          </div>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${!isSignUp ? 'active' : ''}`}
              onClick={() => {
                setIsSignUp(false)
                setLocalError('')
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${isSignUp ? 'active' : ''}`}
              onClick={() => {
                setIsSignUp(true)
                setLocalError('')
              }}
            >
              Create Account
            </button>
          </div>

          <div className="auth-heading-area">
            <h2>{isSignUp ? 'Join My Food' : 'Welcome back'}</h2>
            <p className="auth-subtitle">
              {isSignUp
                ? 'Create your client account with name, email and password'
                : 'Enter your credentials to access orders & favorites'}
            </p>
          </div>

          {localError && <div className="auth-alert error">{localError}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="auth-name">Full Name *</label>
                <input
                  id="auth-name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Sophia Loren"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Email Address *</label>
              <input
                id="auth-email"
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth-password">Password *</label>
              <input
                id="auth-password"
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </div>

            {isSignUp && (
              <div className="auth-info-note">
                <span className="info-icon">ℹ️</span>
                <span>
                  Default role is set to <strong>Client</strong>. You can add or update your
                  gender, age, and shipping address anytime in your <strong>Profile</strong>.
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn auth-submit-btn"
            >
              {submitting
                ? 'Processing...'
                : isSignUp
                ? 'Create Account'
                : 'Sign In to My Food'}
            </button>
          </form>

          <div className="auth-switch-prompt">
            {isSignUp ? (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  className="link-btn inline"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                New customer?{' '}
                <button
                  type="button"
                  className="link-btn inline"
                  onClick={() => setIsSignUp(true)}
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
