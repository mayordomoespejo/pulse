import Logo from '../common/Logo'

function Title({ text = '', className = '' }) {
  return (
    <div className={`title ${className}`}>
      <Logo className="title__logo" />
      {text && <h1 className="title__text">{text}</h1>}
    </div>
  )
}

export default Title
