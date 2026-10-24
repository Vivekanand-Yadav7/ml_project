import { Link, NavLink, useNavigate } from 'react-router-dom'
import Icon from './Icons.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="nav">
      <Link to="/" className="logo">My Food</Link>
      <nav className="nav-links" aria-label="Main">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/orders">Orders</NavLink>

        <NavLink to="/cart" className="icon-btn" aria-label={`Cart, ${count} items`}>
          <Icon name="bag" size={22} />
          {count > 0 && <span className="badge">{count}</span>}
        </NavLink>

        {user ? (
          <div className="nav-user-cluster">
            <NavLink to="/profile" className="user-pill-link" title="My Profile">
              <span
                className="user-avatar-small"
                style={{
                  overflow: 'hidden',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {user.image_url ? (
                  <img
                    src={user.image_url}
                    alt={user.name || 'User'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  (user.name || user.email || 'U')[0].toUpperCase()
                )}
              </span>
              <span className="user-nav-name">{user.name?.split(' ')[0] || 'Profile'}</span>
            </NavLink>
            <button
              onClick={() => {
                logout()
                navigate('/auth')
              }}
              className="btn sm ghost nav-logout-btn"
              title="Sign out"
            >
              Logout
            </button>
          </div>
        ) : (
          <NavLink to="/auth" className="btn sm">
            Sign In
          </NavLink>
        )}
      </nav>
    </header>
  )
}
