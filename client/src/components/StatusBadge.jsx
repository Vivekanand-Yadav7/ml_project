export default function StatusBadge({ status = 'pending' }) {
  const norm = (status || 'pending').toLowerCase().replace(/[_\s]/g, '-')
  
  const labelMap = {
    'pending': 'Pending',
    'preparing': 'Preparing',
    'on-the-way': 'On The Way',
    'out-for-delivery': 'Out For Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
  }

  const label = labelMap[norm] || status

  return (
    <span className={`status-badge status-${norm}`}>
      <span className="status-dot" />
      {label}
    </span>
  )
}
