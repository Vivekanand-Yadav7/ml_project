import { useState } from 'react'
import StatusBadge from './StatusBadge.jsx'

export default function OrderCard({ order, product, onCancel, onUpdateStatus }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const isPending = (order.status || 'pending').toLowerCase() === 'pending'

  const handleCancel = async () => {
    if (window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      setIsUpdating(true)
      try {
        await onCancel(order.id)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const handleStatusChange = async (e) => {
    const nextStatus = e.target.value
    if (!nextStatus || nextStatus === order.status) return
    setIsUpdating(true)
    try {
      await onUpdateStatus(order.id, nextStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <article className="order-card card">
      <div className="order-card-header">
        <div className="order-meta">
          <span className="order-id">Order #{order.id}</span>
          <span className="order-date">
            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="order-card-body">
        <div className="order-product-preview">
          <div
            className="order-product-icon"
            style={{
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {order.image_url || product?.image_url ? (
              <img
                src={order.image_url || product?.image_url}
                alt="Order item"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            ) : (
              '🍱'
            )}
          </div>
          <div className="order-product-details">
            <h4>{product?.name || `Product ID: ${order.product_id}`}</h4>
            {product?.retailer && <p className="retailer-name">From {product.retailer}</p>}
            {product?.tag_line && <p className="order-tagline">{product.tag_line}</p>}
            {product?.price && <p className="order-price">${Number(product.price).toFixed(2)}</p>}
          </div>
        </div>

        {/* Tracking step indicator */}
        <div className="tracking-timeline">
          {['pending', 'preparing', 'on the way', 'delivered'].map((step, idx) => {
            const currentIdx = ['pending', 'preparing', 'on the way', 'delivered'].indexOf(
              (order.status || 'pending').toLowerCase()
            )
            const isCompleted = currentIdx >= idx
            const isCurrent = currentIdx === idx

            return (
              <div key={step} className={`step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}>
                <div className="step-dot" />
                <span className="step-label">{step}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="order-card-footer">
        <div className="order-actions-left">
          {/* Quick status toggle for simulation/retailer role */}
          <select
            className="select sm status-select"
            value={order.status || 'pending'}
            onChange={handleStatusChange}
            disabled={isUpdating}
            title="Change status"
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="on the way">On the way</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="order-actions-right">
          {isPending && (
            <button
              type="button"
              className="btn sm ghost danger-btn"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              {isUpdating ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
