function Tags({ tags = [], className }) {
  if (!tags?.length) return null

  return (
    <>
      {tags?.length > 0 && (
        <ul className={`tags ${className}`}>
          {tags.map((tag, index) => {
            const key = typeof tag === 'string' ? tag : tag?.id ?? `${index}-${tag?.name}`
            const tagName = typeof tag === 'string' ? tag : tag?.name
            return (
              <li key={key} className="tags__tag" style={{ color: tag?.color ?? 'var(--color-secondary)' }}>
                #{tagName}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

export default Tags
