import { Trans, useTranslation } from 'react-i18next'

import Button from '../ui/Button'
import Modal from '../ui/Modal'

/**
 * RemoveModal - Modal de confirmación para eliminar un vídeo
 *
 * @param {Object}   props
 * @param {string}   props.title       Título del vídeo a eliminar
 * @param {Function} props.onCancel    Función que se llama al cancelar
 * @param {Function} props.onConfirm   Función que se llama al confirmar
 * @param {boolean}  props.isDeleting  Si se está procesando la eliminación
 */

function RemoveModal({ title, onCancel, onConfirm, isPending }) {
  const { t } = useTranslation()
  const REMOVE_MODAL = t('REMOVE_MODAL', { returnObjects: true })

  return (
    <Modal
      title={REMOVE_MODAL.TITLE}
      onClose={onCancel}
      actions={
        <>
          <Button
            onClick={onCancel}
            label={REMOVE_MODAL.BUTTON.CANCEL}
            theme="secondary"
            size="medium"
          />
          <Button
            onClick={onConfirm}
            label={REMOVE_MODAL.BUTTON.CONFIRM}
            theme="remove"
            size="medium"
            disabled={isPending}
          />
        </>
      }
    >
      <div className="remove-modal__content">
        <p>
          <Trans
            i18nKey="REMOVE_MODAL.BODY.LINE_1"
            values={{ title }}
            components={{ 1: <b /> }}
          />
        </p>
        <p>{REMOVE_MODAL.BODY.LINE_2}</p>
      </div>
    </Modal>
  )
}

export default RemoveModal
