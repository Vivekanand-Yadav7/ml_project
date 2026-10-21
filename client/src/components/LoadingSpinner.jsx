export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="spinner-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '16px' }}>
      <div className="spinner" />
      {text && <p style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>{text}</p>}
    </div>
  )
}
