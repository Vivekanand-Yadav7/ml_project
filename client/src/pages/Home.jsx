import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import ProductCard from '../components/ProductCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { productAPI, orderAPI } from '../services/api.js'
import { sampleProducts, categories } from '../data/dishes.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [stockOnly, setStockOnly] = useState(true)
  const [orderNotice, setOrderNotice] = useState(null)

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const data = await productAPI.getAll().catch(() => null)
        const list = Array.isArray(data)
          ? data
          : data?.products || data?.data || sampleProducts
        setProducts(list)
      } catch (err) {
        console.warn('API error, using curated menu:', err)
        setProducts(sampleProducts)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filter products: MUST be in stock if stockOnly is active (as per requirement: "whatever is in the stoc")
  const filteredProducts = products.filter((item) => {
    const isAvailable = item.amount === undefined || Number(item.amount) > 0
    if (stockOnly && !isAvailable) return false

    if (selectedCategory !== 'all') {
      const matchCat =
        item.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        item.cuisine?.toLowerCase() === selectedCategory.toLowerCase()
      if (!matchCat) return false
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const matchName = item.name?.toLowerCase().includes(query)
      const matchTag = item.tag_line?.toLowerCase().includes(query)
      const matchRetailer = item.retailer?.toLowerCase().includes(query)
      if (!matchName && !matchTag && !matchRetailer) return false
    }

    return true
  })

  // Handle instant single-product order: POST api/v1/orders
  // schema: { id, ordered_by, status, product_id }
  const handleInstantOrder = async (product) => {
    if (!user) {
      navigate('/auth', { state: { message: 'Please sign in to place an order.' } })
      return
    }

    try {
      setOrderNotice(`Placing order for "${product.name}"...`)
      await orderAPI.create({
        ordered_by: user.id || user.email,
        product_id: product.id,
        status: 'pending',
      }).catch(() => {
        // Fallback simulate local persistence for preview
        const stored = JSON.parse(localStorage.getItem('myfood_orders') || '[]')
        const newOrder = {
          id: 'ord_' + Math.floor(1000 + Math.random() * 9000),
          ordered_by: user.id || user.email,
          product_id: product.id,
          status: 'pending',
          created_at: new Date().toISOString(),
        }
        localStorage.setItem('myfood_orders', JSON.stringify([newOrder, ...stored]))
      })

      setOrderNotice(`Order placed successfully! Redirecting to orders...`)
      setTimeout(() => {
        navigate('/orders')
      }, 900)
    } catch (err) {
      setOrderNotice(`Failed to order: ${err.message}`)
      setTimeout(() => setOrderNotice(null), 3000)
    }
  }

  return (
    <div className="home-wrapper">
      <Hero />

      {orderNotice && (
        <div className="toast-banner">
          <span>{orderNotice}</span>
        </div>
      )}

      {/* Catalogue Section */}
      <section className="section wrap" id="catalogue">
        <SectionHead lead="Fresh Menu" title="In Stock Today" />

        {/* Filter and Search Bar */}
        <div className="menu-controls-bar">
          {/* Category Pills */}
          <div className="category-scroll-pills">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="search-and-stock-controls">
            <div className="search-input-wrap">
              <input
                type="text"
                placeholder="Search by dish, flavor, retailer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="catalogue-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>

            <label className="stock-toggle-label">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
              />
              <span>In-stock only</span>
            </label>
          </div>
        </div>

        {/* Product Count indicator */}
        <div className="catalogue-meta-row">
          <p className="item-count-text">
            Showing <strong>{filteredProducts.length}</strong> fresh dishes in stock
          </p>
        </div>

        {/* Loading / Error / Grid */}
        {loading ? (
          <LoadingSpinner text="Fetching fresh menu from kitchen..." />
        ) : error ? (
          <div className="error-card">
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-catalogue">
            <div className="empty-icon">🍳</div>
            <h3>No in-stock dishes found</h3>
            <p>Try resetting filters or searching for another ingredient or cuisine.</p>
            <button
              type="button"
              className="btn sm ghost"
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
                setStockOnly(false)
              }}
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="dish-grid">
            {filteredProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onOrderNow={handleInstantOrder}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
