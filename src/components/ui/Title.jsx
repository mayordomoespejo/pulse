import Logo from '../common/Logo'

/**
 * App title lockup: logo + optional h1 text.
 *
 * @param {Object} props
 * @param {string} [props.text]
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
function Title({ text = '', className = '' }) {
  return (
    <div className={`title ${className}`}>
      <Logo className="title__logo" />
      {text && <h1 className="title__text">{text}</h1>}
    </div>
  )
}

export default Title
