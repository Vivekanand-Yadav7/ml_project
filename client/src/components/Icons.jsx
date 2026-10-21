const base = { width: 36, height: 36, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

const paths = {
  egg: <><path d="M5 12c0-4 3-8 7-8s7 3 7 7-3 9-8 9-6-4-6-8z" /><circle cx="12" cy="12" r="3" /></>,
  croissant: <><path d="M3 16c0-5 4-9 9-9s9 4 9 9" /><path d="M8 8l-2 8M12 7v9M16 8l2 8" /></>,
  cocktail: <><path d="M4 5h16l-8 9z" /><path d="M12 14v6M8 20h8" /></>,
  burger: <><path d="M4 11c0-4 3-6 8-6s8 2 8 6z" /><path d="M3 14h18M5 17h14M6 20h12" /></>,
  bowl: <><path d="M3 12h18c0 4-3 8-9 8s-9-4-9-8z" /><path d="M8 4l-1 6M12 4v6M16 4l1 6" /></>,
  wine: <><path d="M8 3h8l-.5 6a3.5 3.5 0 01-7 0z" /><path d="M12 13v7M8 20h8" /></>,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4-4" /></>,
  bag: <><path d="M5 8h14l-1 12H6z" /><path d="M9 8a3 3 0 016 0" /></>,
}

export default function Icon({ name, size = 36 }) {
  return <svg {...base} width={size} height={size}>{paths[name]}</svg>
}
