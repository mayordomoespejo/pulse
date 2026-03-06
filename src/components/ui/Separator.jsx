/**
 * Separator - Línea divisoria reutilizable
 *
 * @param {Object} props
 * @param {'horizontal' | 'vertical'} [props.direction='vertical'] Dirección de la línea
 */

function Separator({ direction = 'vertical' }) {
  return <div className={`separator separator--${direction}`} />
}

export default Separator
