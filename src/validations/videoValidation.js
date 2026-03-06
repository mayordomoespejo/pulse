import * as Yup from 'yup'

export const videoValidation = (t, isEdit) =>
  Yup.object({
    title: Yup.string().trim().required(t?.('VIDEO_FORM_MODAL.VALIDATION.TITLE')),
    video: isEdit
      ? Yup.mixed().nullable()
      : Yup.mixed()
        .required(t?.('VIDEO_FORM_MODAL.VALIDATION.VIDEO'))
        .test('fileSize', t?.('VIDEO_FORM_MODAL.VALIDATION.VIDEO_SIZE'), (file) => {
          if (!file) return false
          const sizeInMB = file.size / (1024 * 1024)
          return sizeInMB <= 500
        })
        .test('fileType', t?.('VIDEO_FORM_MODAL.VALIDATION.VIDEO_TYPE'), (file) => {
          if (!file) return false
          const type = file.type || ''
          return type === 'video/mp4'
        })
  })


