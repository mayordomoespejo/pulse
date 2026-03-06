import Tags from './Tags'

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