import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className="section wrap empty">
        <p>We couldn't find that page.</p>
        <Link to="/" className="btn">Back to home</Link>
      </section>
    </>
  )
}
