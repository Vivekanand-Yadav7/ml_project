import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Categories from '../components/Categories.jsx'
import FilterBar from '../components/FilterBar.jsx'
import DishCard from '../components/DishCard.jsx'
import { dishes } from '../data/dishes.js'

export default function Menu() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category')
  const [sort, setSort] = useState('popular')
  const [cuisine, setCuisine] = useState('all')
  const cuisines = [...new Set(dishes.map((d) => d.cuisine))]

  const list = useMemo(() => {
    let out = dishes.filter((d) => (!category || d.category === category) && (cuisine === 'all' || d.cuisine === cuisine))
    if (sort === 'price-asc') out = [...out].sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') out = [...out].sort((a, b) => b.price - a.price)
    else out = [...out].sort((a, b) => Number(b.popular) - Number(a.popular))
    return out
  }, [category, cuisine, sort])

  const pick = (id) => (id === category ? setParams({}) : setParams({ category: id }))

  return (
    <>
      <Categories active={category} onSelect={pick} />
      <section className="wrap" style={{ paddingBottom: 24 }}>
        <FilterBar sort={sort} onSort={setSort} cuisine={cuisine} onCuisine={setCuisine} cuisines={cuisines} count={list.length} />
        {list.length ? (
          <div className="dish-grid">{list.map((d) => <DishCard key={d.id} dish={d} />)}</div>
        ) : (
          <p>No dishes match these filters. Try another category or cuisine.</p>
        )}
      </section>
    </>
  )
}

