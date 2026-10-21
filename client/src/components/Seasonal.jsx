import SectionHead from './SectionHead.jsx'
import DishCard from './DishCard.jsx'
import { dishes } from '../data/dishes.js'

export default function Seasonal() {
  return (
    <section className="section wrap">
      <SectionHead lead="Popular" title="Near you" right />
      <div className="season-grid">
        {dishes.filter((d) => d.popular).slice(0, 5).map((d) => <DishCard key={d.id} dish={d} compact />)}
      </div>
    </section>
  )
}
