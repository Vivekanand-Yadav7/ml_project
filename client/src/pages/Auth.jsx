import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'female',
    age: '',
    shipping_address: '',
    role: 'customer',
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

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in both email and password.')
      return
    }

    if (isSignUp && !formData.name) {
      setLocalError('Please enter your full name.')
      return
    }

    setSubmitting(true)
    try {
      if (isSignUp) {
        // Schema: { id, name, email, password, gender, age, shipping_address, role }
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          age: formData.age ? parseInt(formData.age, 10) : null,
          shipping_address: formData.shipping_address,
          role: formData.role || 'customer',
        })
      } else {
        await login({
          email: formData.email,
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
                ? 'Fill in your delivery details to explore our curated menu'
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
              />
            </div>

            {isSignUp && (
              <>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="auth-gender">Gender</label>
                    <select
                      id="auth-gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="form-input form-select"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other / Prefer not to say</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label htmlFor="auth-age">Age</label>
                    <input
                      id="auth-age"
                      type="number"
                      name="age"
                      min="1"
                      max="120"
                      placeholder="e.g. 26"
                      value={formData.age}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="auth-address">Shipping Address</label>
                  <textarea
                    id="auth-address"
                    name="shipping_address"
                    rows="2"
                    placeholder="Street, apartment or suite, city, postal code"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="auth-role">Account Role</label>
                  <select
                    id="auth-role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    <option value="customer">Customer</option>
                    <option value="retailer">Food Retailer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn auth-submit-btn"
            >
              {submitting
                ? 'Processing...'
                : isSignUp
                ? 'Create My Account'
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
