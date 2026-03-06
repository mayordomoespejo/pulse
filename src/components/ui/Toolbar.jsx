import Tooltip from './Tooltip'

function Toolbar({ actions = [], className = '', disabled = false }) {

  const isDeleteAction = (action) => {
    return action.isDelete ||
      action.label?.toLowerCase().includes('delete') ||
      action.label?.toLowerCase().includes('eliminar')
  }

  const isLargeIcon = (action) => {
    const icon = action.icon
    if (icon?.props) {
      const width = icon.props.width
      const height = icon.props.height
      return (width && parseInt(width) > 20) || (height && parseInt(height) > 16)
    }
    return false
  }

  if (actions?.length === 0) return null

  return (
    <div className={`toolbar ${disabled ? 'toolbar--disabled' : ''} ${className}`}>
      {Array.isArray(actions) && actions.map((action) => (
        <Tooltip content={action.label} key={action.label}>
          <li
            className={`toolbar__action ${disabled ? 'toolbar__action--disabled' : ''} ${isDeleteAction(action) ? 'toolbar__action--delete' : ''} ${isLargeIcon(action) ? 'toolbar__action--large' : ''}`}
            onClick={disabled ? undefined : action.onClick}
          >
            {action.icon}
          </li>
        </Tooltip>
      ))}
    </div>
  )
}

export default Toolbar

