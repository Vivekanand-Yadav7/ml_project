import { Link } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Img from './Placeholder.jsx'

export default function Hero() {
  return (
    <section className="hero">
      <Navbar />
      <div className="hero-inner">
        <div className="hero-copy">
          <h1>Fresh from<br />our kitchen</h1>
          <p className="sub">Hot meals at your door in 30 minutes</p>
          <div className="meta">
            <span><span className="pill">Free delivery</span><span className="pill">Over $25</span></span>
            <span>30 min</span>
          </div>
          <Link to="/menu" className="btn">Order now</Link>
        </div>
        <div className="hero-media"><Img src={null} alt="Featured dish" /></div>
      </div>
    </section>
  )
}
