/**
 * ProgressBar - Barra de progreso visual para cuestionarios o formularios por pasos
 *
 * Calcula y muestra el porcentaje de avance actual basado en la posición y el total de pasos.
 * También incluye atributos `aria` para accesibilidad.
 *
 * @param {Object} props
 * @param {number} props.current Paso actual (empezando en 0)
 * @param {number} props.total   Número total de pasos
 */

function ProgressBar({ current, total }) {
  const clampedCurrent = Math.max(0, Math.min(current, total))
  const percentage = total === 0 ? 0 : (clampedCurrent / total) * 100

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={clampedCurrent + 1}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <div className="progress-bar__filler" style={{ width: `${percentage}%` }} />
    </div>
  )
}

export default ProgressBar
