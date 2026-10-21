import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import Img from './Placeholder.jsx'
import Icon from './Icons.jsx'

export default function ProductCard({ product, onOrderNow }) {
  const { add } = useCart()
  const [showDetails, setShowDetails] = useState(false)
  const [addedNotice, setAddedNotice] = useState(false)

  const {
    id,
    name,
    tag_line,
    description,
    nutrients,
    ingredients,
    retailer,
    amount,
    price,
  } = product

  const inStock = amount === undefined || Number(amount) > 0
  const displayPrice = typeof price === 'number' ? `$${price.toFixed(2)}` : (price ? `$${price}` : '$0.00')

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!inStock) return
    add({
      id: id || name,
      name,
      price: typeof price === 'number' ? price : parseFloat(price) || 0,
      retailer,
      tag_line,
    })
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 1400)
  }

  const handleOrderNow = (e) => {
    e.stopPropagation()
    if (!inStock) return
    if (onOrderNow) {
      onOrderNow(product)
    }
  }

  return (
    <>
      <article className={`card product-card ${!inStock ? 'out-of-stock' : ''}`}>
        <div className="product-media thumb" onClick={() => setShowDetails(true)} role="button" tabIndex={0}>
          <Img src={product.image || null} alt={name} />
          {retailer && <span className="retailer-tag">{retailer}</span>}
          {inStock ? (
            <span className="stock-pill in-stock">
              {amount !== undefined ? `${amount} in stock` : 'In stock'}
            </span>
          ) : (
            <span className="stock-pill no-stock">Sold out</span>
          )}
        </div>

        <div className="body">
          <div className="product-header" onClick={() => setShowDetails(true)} role="button" tabIndex={0}>
            <h3>{name}</h3>
            {tag_line && <p className="tag-line">{tag_line}</p>}
            {description && <p className="desc clamp-2">{description}</p>}
          </div>

          <div className="product-meta">
            {nutrients && (
              <span className="pill-small">
                {typeof nutrients === 'string' ? nutrients : Object.entries(nutrients).map(([k, v]) => `${k}: ${v}`).join(' · ')}
              </span>
            )}
          </div>

          <div className="row product-footer">
            <span className="price">{displayPrice}</span>
            <div className="actions">
              <button
                type="button"
                className={`btn sm ${addedNotice ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={!inStock}
                title={inStock ? 'Add to bag' : 'Out of stock'}
              >
                {addedNotice ? 'Added ✓' : '+ Add'}
              </button>
              {onOrderNow && (
                <button
                  type="button"
                  className="btn sm ghost"
                  onClick={handleOrderNow}
                  disabled={!inStock}
                >
                  Order
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Product Details Modal */}
      {showDetails && (
        <div className="modal-backdrop" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetails(false)} aria-label="Close">
              ×
            </button>
            <div className="modal-grid">
              <div className="modal-image">
                <Img src={product.image || null} alt={name} />
              </div>
              <div className="modal-info">
                {retailer && <span className="badge-chip">{retailer}</span>}
                <h2>{name}</h2>
                {tag_line && <p className="sub-tag">{tag_line}</p>}
                <div className="modal-price-row">
                  <span className="price large">{displayPrice}</span>
                  <span className={`stock-pill ${inStock ? 'in-stock' : 'no-stock'}`}>
                    {inStock ? `${amount || 1} available` : 'Currently unavailable'}
                  </span>
                </div>
                {description && (
                  <div className="detail-block">
                    <h4>Description</h4>
                    <p>{description}</p>
                  </div>
                )}
                {ingredients && (
                  <div className="detail-block">
                    <h4>Ingredients</h4>
                    <p>{Array.isArray(ingredients) ? ingredients.join(', ') : ingredients}</p>
                  </div>
                )}
                {nutrients && (
                  <div className="detail-block">
                    <h4>Nutrition Information</h4>
                    <p>{typeof nutrients === 'string' ? nutrients : JSON.stringify(nutrients)}</p>
                  </div>
                )}
                <div className="modal-actions">
                  <button
                    className="btn"
                    onClick={(e) => {
                      handleAddToCart(e)
                      setShowDetails(false)
                    }}
                    disabled={!inStock}
                  >
                    Add To Cart • {displayPrice}
                  </button>
                  {onOrderNow && (
                    <button
                      className="btn ghost"
                      onClick={(e) => {
                        handleOrderNow(e)
                        setShowDetails(false)
                      }}
                      disabled={!inStock}
                    >
                      Instant Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
