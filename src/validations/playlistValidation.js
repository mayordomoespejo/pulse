import * as Yup from 'yup'

export const getPlaylistValidationSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .trim()
      .required(t?.('PLAYLIST_FORM_MODAL.VALIDATION.TITLE')),
    schedules: Yup.array().of(
      Yup.object().shape({
        scheduledAt: Yup.string().required(t?.('PLAYLIST_FORM_MODAL.VALIDATION.SCHEDULE_REQUIRED'))
      })
    )
  })
