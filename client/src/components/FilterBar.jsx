export default function FilterBar({ sort, onSort, cuisine, onCuisine, cuisines, count }) {
  return (
    <div className="filters">
      <select className="select" value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Sort dishes">
        <option value="popular">Popular</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
      <select className="select" value={cuisine} onChange={(e) => onCuisine(e.target.value)} aria-label="Filter by cuisine">
        <option value="all">All cuisines</option>
        {cuisines.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <span className="count">{count} items</span>
    </div>
  )
}
