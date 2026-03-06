import { EditIcon, BinIcon } from '../../assets/icons/icons'

function TagRow({ tag, onEdit, onRemove }) {
  const safeColor = typeof tag?.color === 'string' ? tag.color : '#E2E8F0'

  const handleClick = (action) => {
    if (action === 'edit') {
      onEdit(tag)
    }
    if (action === 'remove') {
      onRemove(tag)
    }
  }
  return (
    <div className="tag-row">
      <div className="tag-row__left">
        <span className="tag-row__color" style={{ backgroundColor: safeColor }} />
        <span className="tag-row__name">{tag?.name}</span>
      </div>
      <div className="tag-row__actions">
        <button className="tag-row__icon-btn tag-row__icon-btn--edit" onClick={() => handleClick('edit')}><EditIcon stroke="currentColor" /></button>
        <button className="tag-row__icon-btn" onClick={() => handleClick('remove')}><BinIcon stroke="var(--color-secondary)" /></button>
      </div>
    </div>
  )
}

export default TagRow
