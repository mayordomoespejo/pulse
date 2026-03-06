import { useQueryClient } from '@tanstack/react-query'
import { Formik, Form } from 'formik'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { CrossCircleIcon } from '../../assets/icons/icons'
import { formatDate } from '../../helpers/date'
import { createPlaylist } from '../../services/playlists/createPlaylist'
import { updatePlaylist } from '../../services/playlists/updatePlaylist'
import usePlaylistModalStore from '../../stores/playlistModalStore'
import { getPlaylistValidationSchema } from '../../validations/playlistValidation'
import Button from '../ui/Button'
import DatePickerMultiple from '../ui/DatePickerMultiple'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import SelectTags from '../ui/SelectTags'

/**
 * PlaylistFormModal - Modal para crear/editar los datos de una playlist
 *
 * @param {Object}   props
 * @param {('create'|'edit')} props.isEdit
 * @param {Function} props.onClose
 * @param {Object} props.playlist
 * @param {Array} props.tagsOptions
 */

function PlaylistFormModal() {
  const { t } = useTranslation()
  const CONSTANTS = t('CONSTANTS', { returnObjects: true })
  const PLAYLIST_FORM_MODAL = t('PLAYLIST_FORM_MODAL', { returnObjects: true })
  const queryClient = useQueryClient()

  const {
    setIsOpenPlaylistAddVideos,
    setSelectedPlaylist,
    selectedPlaylist,
    setIsOpenPlaylistForm,
    isOpenPlaylistForm,
  } = usePlaylistModalStore()

  const isEdit = selectedPlaylist?.id || null
  const { id, name, tags, playlistItems, schedules } = selectedPlaylist || {}

  const initialTags = useMemo(() => {
    return Array.isArray(tags) ? tags?.map((tag) => ({
      label: tag?.name, value: tag?.id, color: tag?.color
    })) : []

  }, [tags])
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true)

    const formattedSchedules = values?.schedules?.map((schedule) => ({
      scheduledAt: +(new Date(schedule?.scheduledAt) / 1000)
    })) || []

    const payload = {
      name: values?.name,
      tags: (values?.tags || []).map((opt) => opt?.value),
      videos: playlistItems?.map((playlistItem) => playlistItem?.video?.id),
      schedules: formattedSchedules
    }

    try {
      if (!isEdit) {
        const response = await createPlaylist(payload)
        toast.success(PLAYLIST_FORM_MODAL.TOAST.CREATE_SUCCESS)
        setIsOpenPlaylistAddVideos(true)
        setSelectedPlaylist(response.data)
        return
      } else {
        await updatePlaylist(id, payload)
        toast.success(PLAYLIST_FORM_MODAL.TOAST.EDIT_SUCCESS)
      }

      queryClient.invalidateQueries({ queryKey: ['playlists'] })
      setIsOpenPlaylistForm(false)
    } catch (error) {
      const { errors } = error?.response?.data ?? {}
      if (errors) {
        Object.entries(errors).forEach(([field, message]) => {
          setFieldError(field, message)
        })
      }

      toast.error(isEdit
        ? PLAYLIST_FORM_MODAL.TOAST.EDIT_ERROR
        : PLAYLIST_FORM_MODAL.TOAST.CREATE_ERROR
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpenPlaylistForm) return null


  const formattedSchedules = schedules?.map((schedule) => ({
    scheduledAt: formatDate(schedule.scheduledAt, 'yyyy-MM-dd')
  })) || []

  const initialValues = {
    name: name || '',
    tags: initialTags,
    schedules: formattedSchedules
  }

  return (
    <Modal
      title={isEdit
        ? PLAYLIST_FORM_MODAL.TITLE_EDIT
        : PLAYLIST_FORM_MODAL.TITLE_CREATE}
      onClose={() => setIsOpenPlaylistForm(false)}
      className="playlist-form-modal"
      classNameBackdrop="playlist-form-modal__backdrop"
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={getPlaylistValidationSchema(t)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="playlist-form-modal__form">
            <Input
              name="name"
              label={PLAYLIST_FORM_MODAL.TITLE_LABEL}
              placeholder={PLAYLIST_FORM_MODAL.TITLE_PLACEHOLDER}
            />
            <SelectTags
              name="tags"
              isMulti
              label={CONSTANTS.TAGS_LABEL}
              useParams={false}
              useFormik={true}
            />
            <div className="playlist-form-modal__schedules">
              <label className="playlist-form-modal__schedules-label">{t('PLAYLIST_FORM_MODAL.SCHEDULES_LABEL')}</label>
              <div className="playlist-form-modal__schedules-list">
                <DatePickerMultiple
                  inputValue={values.schedules}
                  setInputValue={(dates) => setFieldValue('schedules', dates.map(date => ({ scheduledAt: date })))}
                />
                <div className="playlist-form-modal__schedules-dates">
                  {values.schedules.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)).map((schedule) => (
                    <span key={schedule.scheduledAt} className="playlist-form-modal__schedules-item"
                      onClick={() => { setFieldValue('schedules', values.schedules.filter(s => s.scheduledAt !== schedule.scheduledAt)) }}>
                      <CrossCircleIcon stroke="var(--color-secondary)" />
                      {formatDate(+(new Date(schedule?.scheduledAt) / 1000), 'dd/MM/yyyy')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              label={isEdit ? CONSTANTS.SAVE : CONSTANTS.CREATE}
              variant="secondary"
              size="medium"
              disabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </Modal >
  )
}

export default PlaylistFormModal
