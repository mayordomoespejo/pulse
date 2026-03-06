import { Formik, Form } from 'formik'
import { useTranslation } from 'react-i18next'

import { tagValidation } from '../../validations/tagValidation'
import Button from '../ui/Button'
import ColorPicker from '../ui/ColorPicker'
import Input from '../ui/Input'
import Modal from '../ui/Modal'

function TagFormModal({
  initialValues,
  isEdit = false,
  onClose,
  onSubmit,
  isPending
}) {

  const { t } = useTranslation()
  const CONSTANTS = t('CONSTANTS', { returnObjects: true })
  const TAG_FORM_MODAL = t('TAG_FORM_MODAL', { returnObjects: true })

  const values = {
    name: initialValues?.name ?? '',
    color: initialValues?.color ?? '#000000',
  }

  return (
    <Modal
      title={isEdit
        ? TAG_FORM_MODAL.TITLE_EDIT
        : TAG_FORM_MODAL.TITLE_CREATE
      }
      onClose={() => onClose(false)}
    >
      <Formik
        enableReinitialize
        initialValues={values}
        validationSchema={tagValidation(t)}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="tag-form-modal__form">
            <Input
              name="name"
              label={TAG_FORM_MODAL.NAME}
              placeholder={TAG_FORM_MODAL.PLACEHOLDER}
            />
            <ColorPicker name="color" label={CONSTANTS.COLOR} />
            <Button
              type="submit"
              label={isEdit ? CONSTANTS.SAVE : CONSTANTS.ADD}
              size="medium"
              variant="secondary"
              disabled={isSubmitting || isPending}
            />
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default TagFormModal


