import SectionHead from './SectionHead.jsx'
import Img from './Placeholder.jsx'
import { promos } from '../data/dishes.js'
import { useCart } from '../context/CartContext.jsx'

export default function Digest() {
  const { add } = useCart()
  return (
    <section className="section wrap">
      <SectionHead lead="Weekly" title="Deals" />
      <p className="digest-intro" style={{ marginTop: -24, marginBottom: 40 }}>Treats picked for this week.</p>
      <div className="digest">
        {promos.map((p) => (
          <article key={p.id} className="promo">
            <div className="thumb"><Img src={p.image} alt={p.text} /></div>
            <div className="text">
              <p>{p.text}</p>
              <div className="row">
                <button className="btn sm" onClick={() => add({ id: p.id, name: p.text, price: p.price })}>Add to cart</button>
                <span className="price">${p.price}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
