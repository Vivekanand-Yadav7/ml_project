export default function SectionHead({ lead, title, right = false }) {
  return (
    <div className={`section-head ${right ? 'right' : ''}`}>
      <h2 className="heading"><small>{lead}</small><span>{title}</span></h2>
      <div className="rule" />
    </div>
  )
}
