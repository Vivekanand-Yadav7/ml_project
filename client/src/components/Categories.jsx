import Icon from './Icons.jsx'
import SectionHead from './SectionHead.jsx'
import { categories } from '../data/dishes.js'

export default function Categories({ active, onSelect }) {
  return (
    <section className="section wrap">
      <SectionHead lead="Browse" title="Categories" />
      <div className="icon-row">
        {categories.map((c) => (
          <button key={c.id} className="cat" aria-pressed={active === c.id} onClick={() => onSelect?.(c.id)}>
            <span className="cat-icon"><Icon name={c.icon} /></span>
            {c.label}
          </button>
        ))}
      </div>
    </section>
  )
}
