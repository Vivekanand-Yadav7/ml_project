import { Link } from 'react-router-dom'
import SectionHead from '../components/SectionHead.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, total, add, dec, remove, clear } = useCart()
  return (
    <>
      <section className="section wrap">
        <SectionHead lead="Your" title="Cart" />
        {items.length === 0 ? (
          <div className="empty">
            <p>Your cart is empty. Add a dish from the menu to get started.</p>
            <Link to="/menu" className="btn">Browse menu</Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {items.map((i) => (
                <div key={i.id} className="cart-line">
                  <strong>{i.name}</strong>
                  <span className="qty">
                    <button onClick={() => dec(i.id)} aria-label={`Remove one ${i.name}`}>−</button>
                    {i.qty}
                    <button onClick={() => add(i)} aria-label={`Add one ${i.name}`}>+</button>
                  </span>
                  <span className="price">${i.price * i.qty}</span>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>Total ${total}</span>
              <span style={{ display: 'flex', gap: 12 }}>
                <button className="btn ghost" onClick={clear}>Clear cart</button>
                <button className="btn">Checkout</button>
              </span>
            </div>
          </>
        )}
      </section>
    </>
  )
}

