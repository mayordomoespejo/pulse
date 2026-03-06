
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useMemo, useRef } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { DEFAULT_VIDEO_THUMBNAIL } from '../../constants/constants.js'
import { createVideo } from '../../services/videos/createVideo.js'
import { updateVideo } from '../../services/videos/updateVideo.js'
import { videoValidation } from '../../validations/videoValidation.js'
import VideoUploadInput from '../common/VideoUploadInput.jsx'
import Button from '../ui/Button.jsx'
import Input from '../ui/Input.jsx'
import Modal from '../ui/Modal.jsx'
import SelectTags from '../ui/SelectTags.jsx'
import Spinner from '../ui/Spinner.jsx'

/**
 * VideoModal - Modal de vídeo genérico para envolver formularios
 *
 * @param {Object} props
 * @param {string} props.mode 'create' o 'edit'
 * @param {Function} props.onCancel
 * @param {JSX.Element} props.children Contenido del formulario
 */

function VideoFormModal({
  isEdit = false,
  onClose,
  video: rawVideo,
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const VIDEO_FORM_MODAL = t('VIDEO_FORM_MODAL', { returnObjects: true })
  const CONSTANTS = t('CONSTANTS', { returnObjects: true })

  const video = rawVideo && typeof rawVideo === 'object' ? rawVideo : {}
  const { id, title, thumbnailUrl, duration, url, tags } = video

  const videoInputData = useMemo(() => {
    if (!isEdit) return undefined

    return {
      thumbnail: thumbnailUrl || DEFAULT_VIDEO_THUMBNAIL,
      duration,
      filename: url?.split('/').pop() ?? ''
    }
  }, [isEdit, thumbnailUrl, duration, url])

  const initialTags = useMemo(() => {
    return Array.isArray(tags) ? tags?.map((tag) => ({
      label: tag?.name, value: tag?.id, color: tag?.color
    })) : []

  }, [tags])

  const closeRef = useRef(null)

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true)

    const payload = {
      title: values?.title,
      file: isEdit ? undefined : values?.video,
      tags: (values?.tags || []).map((opt) => opt?.value),
    }

    try {
      if (!isEdit) {
        await createVideo(payload)
        toast.success(VIDEO_FORM_MODAL.TOAST.CREATE_SUCCESS)
      } else {
        await updateVideo(id, payload)
        toast.success(VIDEO_FORM_MODAL.TOAST.EDIT_SUCCESS)
      }
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      onClose(false)

    } catch (error) {
      const { data, status } = error?.response ?? {}
      const { errors } = data ?? {}

      if (errors) {
        Object.entries(errors || {}).forEach(([field, message]) => {
          setFieldError(field, message)
        })
      }

      if (status === 500) {
        toast.error(CONSTANTS.GENERAL_ERROR)
        return
      }

      toast.error(!isEdit
        ? VIDEO_FORM_MODAL.TOAST.CREATE_ERROR
        : VIDEO_FORM_MODAL.TOAST.EDIT_ERROR)
    } finally {
      setSubmitting(false)
    }
  }

  const editValues = {
    title: title ?? '',
    video: null,
    tags: initialTags,
  }

  return (
    <Modal
      title={isEdit ? VIDEO_FORM_MODAL.TITLE_EDIT : VIDEO_FORM_MODAL.TITLE_CREATE}
      onClose={() => onClose(false)}
      onCloseRef={closeRef}
    >
      <Formik
        enableReinitialize
        initialValues={editValues}
        validationSchema={videoValidation(t, isEdit)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="video-form-modal__content" aria-busy={isSubmitting}>
            <VideoUploadInput
              name="video"
              error={errors?.video}
              video={videoInputData}
            />
            <Input
              label={VIDEO_FORM_MODAL.TITLE_LABEL}
              name="title"
              placeholder={VIDEO_FORM_MODAL.TITLE_PLACEHOLDER}
            />
            <SelectTags
              name="tags"
              isMulti
              label={CONSTANTS.TAGS_LABEL}
              useParams={false}
              useFormik={true}
            />
            <Button
              type="submit"
              label={isEdit
                ? CONSTANTS.SAVE
                : `${CONSTANTS.UPLOAD} ${CONSTANTS.VIDEO}`
              }
              variant="secondary"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              iconEnd={isSubmitting ? <Spinner size="button" /> : null}
              className="video-form-modal__button"
            />
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default VideoFormModal
