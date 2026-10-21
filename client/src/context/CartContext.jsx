import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const found = state.find((i) => i.id === action.item.id)
      if (found) return state.map((i) => (i.id === found.id ? { ...i, qty: i.qty + 1 } : i))
      return [...state, { ...action.item, qty: 1 }]
    }
    case 'dec':
      return state.flatMap((i) => (i.id === action.id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]))
    case 'remove':
      return state.filter((i) => i.id !== action.id)
    case 'clear':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [])
  const value = useMemo(() => ({
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    total: items.reduce((n, i) => n + i.qty * i.price, 0),
    add: (item) => dispatch({ type: 'add', item }),
    dec: (id) => dispatch({ type: 'dec', id }),
    remove: (id) => dispatch({ type: 'remove', id }),
    clear: () => dispatch({ type: 'clear' }),
  }), [items])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
