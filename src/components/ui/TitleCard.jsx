import Tags from './Tags'

/**
 * Card title with an optional tag list and click handler.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {Array} [props.tags=[]]
 * @param {string} [props.className]
 * @param {Function|null} [props.onClick=null]
 * @param {boolean} [props.disabled=false]
 * @returns {JSX.Element}
 */
function TitleCard({ title, tags = [], className, onClick = null, disabled = false }) {
  return (
    <div className={`title-card ${className}`}>
      <span
        className={
          `title-card__title 
          ${onClick && 'title-card__title--clickable'}
        ${disabled && 'title-card__title--disabled'}`}
        onClick={onClick}>
        {title}
      </span>
      <Tags tags={tags} />
    </div>
  )
}

export default TitleCard