import Img from './Placeholder.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function DishCard({ dish, compact = false }) {
  const { add } = useCart()
  if (compact) {
    return (
      <article className="card compact">
        <div className="thumb"><Img src={dish.image} alt={dish.name} /></div>
        <div className="info">
          <h3>{dish.name}</h3>
          <p className="desc">{dish.desc}</p>
        </div>
      </article>
    )
  }
  return (
    <article className="card">
      <h3>{dish.name}</h3>
      <div className="thumb"><Img src={dish.image} alt={dish.name} /></div>
      <div className="body">
        <p className="desc">{dish.desc}</p>
        <div className="row">
          <button className="link-btn" onClick={() => add(dish)}>Add to cart</button>
          <span className="price">${dish.price}</span>
        </div>
      </div>
    </article>
  )
}
