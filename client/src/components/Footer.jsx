import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div>
          <p className="logo" style={{ color: 'var(--olive)' }}>My Food</p>
          <p style={{ fontSize: 14, marginTop: 6 }}>Tasty meals delivered fast.</p>
        </div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/cart">Cart</Link></li>
        </ul>
        <div className="newsletter">
          <p>Get weekly deals in your inbox.</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" aria-label="Email address" required />
            <button className="btn" type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </footer>
  )
}
