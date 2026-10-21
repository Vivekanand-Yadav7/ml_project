// Shows the image if provided, otherwise a soft sand block. Swap for real photos later.
export default function Img({ src, alt = '' }) {
  if (src) return <img src={src} alt={alt} loading="lazy" />
  return (
    <svg viewBox="0 0 10 6" preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt || 'Image placeholder'}>
      <rect width="10" height="6" fill="#e4d9ae" />
      <circle cx="5" cy="3" r="1.3" fill="none" stroke="#667004" strokeWidth="0.12" opacity=".5" />
    </svg>
  )
}
