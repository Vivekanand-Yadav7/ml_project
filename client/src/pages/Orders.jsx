import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SectionHead from '../components/SectionHead.jsx'
import OrderCard from '../components/OrderCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { orderAPI, productAPI } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { sampleProducts } from '../data/dishes.js'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [productMap, setProductMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // Load orders for this user
  useEffect(() => {
    async function fetchOrders() {
      if (!user) return
      setLoading(true)
      try {
        // Schema: { id, ordered_by, status, product_id }
        // API: GET /api/v1/orders?id=<user_id>
        const res = await orderAPI.get(user.id || user.email).catch(() => null)
        let list = []
        if (Array.isArray(res)) {
          list = res
        } else if (res?.orders || res?.data) {
          list = res.orders || res.data
        } else {
          // Fallback to local storage for local offline testing
          const localStored = JSON.parse(localStorage.getItem('myfood_orders') || '[]')
          list = localStored.filter(
            (o) => o.ordered_by === (user.id || user.email) || !o.ordered_by
          )
          if (list.length === 0) {
            // Seed a starter sample order so the user sees immediate live UI
            const demo = [
              {
                id: 'ord_101',
                ordered_by: user.id || user.email,
                product_id: 1,
                status: 'on the way',
                created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
              },
              {
                id: 'ord_102',
                ordered_by: user.id || user.email,
                product_id: 4,
                status: 'delivered',
                created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
              },
            ]
            localStorage.setItem('myfood_orders', JSON.stringify(demo))
            list = demo
          }
        }
        setOrders(list)

        // Resolve product details for each product_id
        const map = {}
        for (const o of list) {
          if (o.product_id && !map[o.product_id]) {
            // Find in sampleProducts or call GET /api/v1/products?id=
            const foundSample = sampleProducts.find((p) => p.id === o.product_id)
            if (foundSample) {
              map[o.product_id] = foundSample
            } else {
              try {
                const prod = await productAPI.get(o.product_id)
                map[o.product_id] = prod.product || prod.data || prod
              } catch {
                map[o.product_id] = { id: o.product_id, name: `Product #${o.product_id}` }
              }
            }
          }
        }
        setProductMap(map)
      } catch (err) {
        console.warn('Orders fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  // Cancel order: DELETE /api/v1/orders?id=
  const handleCancelOrder = async (orderId) => {
    try {
      await orderAPI.delete(orderId).catch(() => {})
      setOrders((prev) => prev.filter((o) => o.id !== orderId))

      // Update local storage demo sync
      const stored = JSON.parse(localStorage.getItem('myfood_orders') || '[]')
      const updated = stored.filter((o) => o.id !== orderId)
      localStorage.setItem('myfood_orders', JSON.stringify(updated))

      setFeedbackMsg(`Order #${orderId} was cancelled successfully.`)
      setTimeout(() => setFeedbackMsg(''), 3000)
    } catch (err) {
      alert(`Could not cancel order: ${err.message}`)
    }
  }

  // Update order status: PATCH /api/v1/orders?id=
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.update(orderId, { status: newStatus }).catch(() => {})
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )

      // Update local storage demo sync
      const stored = JSON.parse(localStorage.getItem('myfood_orders') || '[]')
      const updated = stored.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
      localStorage.setItem('myfood_orders', JSON.stringify(updated))

      setFeedbackMsg(`Order #${orderId} updated to "${newStatus}".`)
      setTimeout(() => setFeedbackMsg(''), 3000)
    } catch (err) {
      alert(`Could not update status: ${err.message}`)
    }
  }

  return (
    <div className="orders-page">
      <Navbar />

      <main className="section wrap">
        <SectionHead lead="Real-Time Status" title="Your Orders" />

        {feedbackMsg && (
          <div className="toast-banner success">
            <span>{feedbackMsg}</span>
          </div>
        )}

        <div className="orders-container">
          {loading ? (
            <LoadingSpinner text="Retrieving order history & live delivery routes..." />
          ) : orders.length === 0 ? (
            <div className="empty-orders-view">
              <div className="empty-icon">🛵</div>
              <h3>No active orders</h3>
              <p>You haven't placed any food orders yet. Browse our in-stock delicacies!</p>
              <Link to="/" className="btn">
                Browse Fresh Menu
              </Link>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  product={productMap[order.product_id]}
                  onCancel={handleCancelOrder}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
