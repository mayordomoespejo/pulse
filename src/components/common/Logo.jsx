import { LogoTextIcon } from '../../assets/icons/icons'

/**
 * Logo - Componente reutilizable del logo con texto completo "PULSE"
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Logo con texto completo
 */
function Logo({
  className = '',
}) {
  return (
    <div className={`logo logo--text ${className}`}>
      <LogoTextIcon className="logo__icon logo__icon--text" fill="var(--color-primary)" />
    </div>
  )
}

export default Logo
