import { useTranslation, Trans } from 'react-i18next'

import Button from '../ui/Button'
import Modal from '../ui/Modal'

function TagRemoveModal({
  tag,
  onCancel,
  onConfirm,
  isPending
}) {
  const { t } = useTranslation()
  const TAG_REMOVE_MODAL = t('TAG_REMOVE_MODAL', { returnObjects: true })
  const CONSTANTS = t('CONSTANTS', { returnObjects: true })

  if (!tag) return null
  return (
    <Modal

      title={TAG_REMOVE_MODAL.TITLE} onClose={onCancel}
      actions={
        <>
          <Button
            theme="secondary"
            size="medium"
            label={CONSTANTS.CANCEL}
            onClick={onCancel}
          />
          <Button
            theme="remove"
            size="medium"
            label={CONSTANTS.DELETE}
            onClick={onConfirm}
            disabled={isPending}
          />

        </>
      }
    >
      <div className="tag-remove-modal__content">
        <p>
          <Trans
            i18nKey="TAG_REMOVE_MODAL.BODY.LINE_1"
            components={{ 1: <b /> }}
            values={{ name: tag?.name }} /></p>
        <p>{TAG_REMOVE_MODAL.BODY.LINE_2}</p>
      </div>
    </Modal>
  )
}

export default TagRemoveModal

