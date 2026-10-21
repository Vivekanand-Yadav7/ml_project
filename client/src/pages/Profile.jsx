import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SectionHead from '../components/SectionHead.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { userAPI } from '../services/api.js'

export default function Profile() {
  const { user, updateProfile, deleteAccount, logout } = useAuth()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    shipping_address: '',
    role: 'client',
  })
  const [saving, setSaving] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Initialize or fetch full user profile via GET api/v1/users?id
  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return
      setLoadingUser(true)
      try {
        const res = await userAPI.get(user.id).catch(() => null)
        const profile = res?.user || res?.data || res || user
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          password: profile.password || '',
          gender: profile.gender || '',
          age: profile.age || '',
          shipping_address: profile.shipping_address || '',
          role: profile.role || 'client',
        })
      } catch (err) {
        console.warn('Profile fetch note:', err)
        setFormData({
          name: user.name || '',
          email: user.email || '',
          password: user.password || '',
          gender: user.gender || '',
          age: user.age || '',
          shipping_address: user.shipping_address || '',
          role: user.role || 'client',
        })
      } finally {
        setLoadingUser(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle PATCH api/v1/user?id
  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg({ text: '', type: '' })
    try {
      await updateProfile({
        name: formData.name,
        password: formData.password,
        gender: formData.gender,
        age: formData.age ? parseInt(formData.age, 10) : null,
        shipping_address: formData.shipping_address,
      })
      setMsg({ text: 'Profile updated successfully via PATCH /api/v1/user!', type: 'success' })
      setIsEditing(false)
    } catch (err) {
      setMsg({ text: err.message || 'Failed to update profile.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // Handle DELETE api/v1/user?id
  const handleDelete = async () => {
    const confirmation = window.confirm(
      'Are you absolutely sure you want to delete your account? This action cannot be undone.'
    )
    if (!confirmation) return

    try {
      await deleteAccount()
      navigate('/auth', { replace: true })
    } catch (err) {
      alert(`Could not delete account: ${err.message}`)
    }
  }

  const hasMissingDetails = !formData.shipping_address || !formData.gender || !formData.age

  return (
    <div className="profile-page">
      <Navbar />

      <main className="section wrap">
        <SectionHead lead="Account Settings" title="Your Profile" />

        {msg.text && (
          <div className={`toast-banner ${msg.type}`}>
            <span>{msg.text}</span>
          </div>
        )}

        {loadingUser ? (
          <LoadingSpinner text="Loading account details..." />
        ) : (
          <div className="profile-layout-grid">
            {/* Left Card: Summary Avatar & Quick Info */}
            <aside className="profile-card profile-sidebar card">
              <div className="profile-avatar-large">
                {(formData.name || formData.email || 'U')[0].toUpperCase()}
              </div>

              <h3 className="profile-name">{formData.name || 'Anonymous Gourmet'}</h3>
              <p className="profile-email">{formData.email}</p>

              <div className="profile-role-chip">
                <span className="role-dot" />
                <span className="role-text">{formData.role?.toUpperCase() || 'CLIENT'}</span>
              </div>

              <div className="profile-divider" />

              <div className="profile-quick-stats">
                <div className="stat-item">
                  <span className="stat-label">Gender</span>
                  <span className="stat-value">{formData.gender || 'Not added yet'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Age</span>
                  <span className="stat-value">{formData.age ? `${formData.age} yrs` : 'Not added yet'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">User ID</span>
                  <span className="stat-value font-mono">{user?.id || 'usr_client'}</span>
                </div>
              </div>

              <div className="profile-sidebar-actions">
                <Link to="/orders" className="btn sm ghost full-width">
                  View Order History
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    navigate('/auth')
                  }}
                  className="btn sm ghost full-width"
                >
                  Sign Out
                </button>
              </div>
            </aside>

            {/* Right Card: Full Details & Edit Form */}
            <section className="profile-card profile-main-card card">
              {hasMissingDetails && !isEditing && (
                <div className="profile-alert-banner">
                  <span>📍 Complete your profile: Add your gender, age & shipping address for fast delivery!</span>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Add Details
                  </button>
                </div>
              )}

              <div className="profile-card-header">
                <div>
                  <h3>Personal Information</h3>
                  <p className="card-subtext">
                    Manage your account details and delivery address (saved via <code>PATCH /api/v1/user?id</code>).
                  </p>
                </div>
                {!isEditing && (
                  <button
                    type="button"
                    className="btn sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="profile-edit-form">
                  <div className="form-group">
                    <label htmlFor="prof-name">Full Name *</label>
                    <input
                      id="prof-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prof-email">Email (Immutable)</label>
                    <input
                      id="prof-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="form-input disabled"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prof-password">Password</label>
                    <input
                      id="prof-password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="form-input"
                    />
                    <small className="field-hint">
                      Enter a new password or leave existing to keep unchanged.
                    </small>
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label htmlFor="prof-gender">Gender</label>
                      <select
                        id="prof-gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-input form-select"
                      >
                        <option value="">Select Gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group flex-1">
                      <label htmlFor="prof-age">Age</label>
                      <input
                        id="prof-age"
                        type="number"
                        name="age"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 25"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="prof-address">Shipping Address</label>
                    <textarea
                      id="prof-address"
                      name="shipping_address"
                      rows="3"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Street address, apartment, city, state, zip"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prof-role">Role</label>
                    <input
                      id="prof-role"
                      type="text"
                      value={formData.role || 'client'}
                      disabled
                      className="form-input disabled"
                    />
                  </div>

                  <div className="form-btn-row">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn sm"
                    >
                      {saving ? 'Saving changes...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn sm ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-display-view">
                  <div className="display-row">
                    <span className="display-label">Full Name</span>
                    <span className="display-value">{formData.name || '—'}</span>
                  </div>

                  <div className="display-row">
                    <span className="display-label">Email Address</span>
                    <span className="display-value">{formData.email || '—'}</span>
                  </div>

                  <div className="display-row">
                    <span className="display-label">Password</span>
                    <span className="display-value">••••••••</span>
                  </div>

                  <div className="display-row">
                    <span className="display-label">Gender</span>
                    <span className="display-value capitalize">{formData.gender || 'Not added yet'}</span>
                  </div>

                  <div className="display-row">
                    <span className="display-label">Age</span>
                    <span className="display-value">{formData.age ? `${formData.age} years old` : 'Not added yet'}</span>
                  </div>

                  <div className="display-row">
                    <span className="display-label">Shipping Address</span>
                    <span className="display-value">
                      {formData.shipping_address || 'No shipping address specified yet.'}
                    </span>
                  </div>

                  <div className="display-row">
                    <span className="display-label">Role</span>
                    <span className="display-value capitalize">{formData.role || 'client'}</span>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              <div className="danger-zone-section">
                <h4>Danger Zone</h4>
                <div className="danger-zone-content">
                  <div>
                    <strong>Delete Account</strong>
                    <p>Permanently remove your account and all associated delivery data.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn sm ghost danger-btn"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
