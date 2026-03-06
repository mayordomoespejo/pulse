import { Field, useField } from 'formik'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CloseIcon, UploadIcon, PadlockIcon } from '../../assets/icons/icons'
import { generateThumbnail } from '../../utils/generateThumbnail'
import VideoDuration from '../video/VideoDuration'

/**
 * VideoUploadInput - Campo de subida de vídeo con vista previa y miniatura generada
 *
 * Componente integrado con Formik que permite al usuario subir un archivo de vídeo. Al seleccionar el vídeo:
 * - Se genera automáticamente una miniatura (thumbnail) a partir del primer fotograma.
 * - Se calcula y muestra la duración del vídeo.
 * - Se autocompleta el campo de título si está vacío.
 * - Se muestra una vista previa del vídeo subido o una imagen bloqueada si está en modo edición.
 * - Permite borrar el archivo seleccionado si no está en modo edición.
 *
 * Props:
 * @param {string} name - Nombre del campo en Formik para el archivo de vídeo.
 * @param {string} [thumbnailName='thumbnail'] - Nombre del campo en Formik para almacenar la miniatura.
 * @param {string} [titleName='title'] - Nombre del campo en Formik que se autocompletará con el nombre del archivo.
 * @param {string} [className=''] - Clases CSS adicionales para el wrapper principal.
 * @param {boolean} [required=false] - Si el campo debe marcarse como obligatorio.
 * @param {Object} [video={}] - Datos precargados en modo edición. Si existen, el input estará bloqueado.
 * @param {string} [video.thumbnail] - URL de la miniatura del vídeo ya subida.
 * @param {number} [video.duration] - Duración del vídeo en segundos (se muestra usando el componente VideoDuration).
 * @param {string} [video.filename] - Nombre del archivo del vídeo.
 *
 * @returns {JSX.Element} Componente visual y funcional para subir vídeos con vista previa.
 */

function VideoUploadInput({
  name,
  thumbnailName = 'thumbnail',
  titleName = 'title',
  className = '',
  video = {},
}) {
  const { t } = useTranslation()
  const VIDEO_UPLOAD_INPUT = t('VIDEO_UPLOAD_INPUT', { returnObjects: true })

  const {
    thumbnail: initialThumbnail = null,
    duration: initialDuration = null,
    filename: initialFilename = null,
  } = video ?? {}

  const isEdit = Boolean(initialThumbnail)

  // Estado para la duración en segundos
  const [duration, setDuration] = useState(initialDuration)
  const [filename, setFilename] = useState(initialFilename)
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnail)
  const [autoTitle, setAutoTitle] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const videoRef = useRef(null)
  const inputRef = useRef(null)
  const hiddenVideoRef = useRef(null)

  const processFile = async (file, setFieldValue, values) => {
    if (!file) return

    setFilename(file.name)
    setFieldValue(name, file)

    const titleWithoutExt = file.name.replace(/\.[^/.]+$/, '')
    if (!values[titleName] || values[titleName] === autoTitle) {
      setFieldValue(titleName, titleWithoutExt)
    }
    setAutoTitle(titleWithoutExt)

    const { blob, url: thumbUrl } = await generateThumbnail(file)
    setThumbnailUrl(thumbUrl)
    setFieldValue(thumbnailName, blob)

    const videoURL = URL.createObjectURL(file)
    if (hiddenVideoRef.current) {
      hiddenVideoRef.current.src = videoURL
    }
  }

  const handleFileChange = async (e, setFieldValue, values) => {
    const file = e.currentTarget.files[0]
    await processFile(file, setFieldValue, values)
  }

  const handleClear = (e, setFieldValue, values) => {
    e.preventDefault()
    e.stopPropagation()

    setFilename(null)
    setThumbnailUrl(null)
    setDuration(null)
    setFieldValue(name, null)
    setFieldValue(thumbnailName, null)

    if (values[titleName] === autoTitle) {
      setFieldValue(titleName, '')
    }

    setAutoTitle(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleLoadedMetadata = () => {
    if (hiddenVideoRef.current) {
      const durationInSeconds = hiddenVideoRef.current.duration
      if (!isNaN(durationInSeconds)) {
        setDuration(durationInSeconds)
      }
    }
  }

  const handleDrag = (e) => {
    if (isEdit) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDrop = async (e, form) => {
    if (isEdit) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer?.files?.[0]
    if (!file) return
    if (!file.type?.startsWith('video/')) return
    await processFile(file, form.setFieldValue, form.values)
  }
  const [field, meta] = useField(name)

  return (
    <div className={`video-upload ${className} ${meta.touched && meta.error ? 'video-upload--error' : ''}`}>
      {isEdit && <p className="video-upload__edit-label">{VIDEO_UPLOAD_INPUT.EDIT_LABEL}</p>}
      <Field name={name}>
        {({ form }) => (
          <>
            <input
              ref={inputRef}
              id={`video-upload-${name}`}
              type="file"
              accept="video/mp4"
              className="video-upload__input"
              onChange={(e) => handleFileChange(e, form.setFieldValue, form.values)}

              onBlur={field.onBlur}
              name={name}
              value={''}
              disabled={isEdit}
            />
            <video
              ref={hiddenVideoRef}
              style={{ display: 'none' }}
              onLoadedMetadata={handleLoadedMetadata}
            />
            {!thumbnailUrl ? (
              <label
                htmlFor={`video-upload-${name}`}
                className={`video-upload__placeholder ${isDragging ? 'video-upload__placeholder--dragging' : ''}`}
                aria-invalid={meta.touched && !!meta.error}
                aria-describedby={meta.touched && meta.error ? `video-upload-error-${name}` : undefined}
                onDragOver={handleDrag}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDrop={(e) => handleDrop(e, form)}
              >
                <UploadIcon fill="currentColor" />
                <p>{VIDEO_UPLOAD_INPUT.PLACEHOLDER}</p>
              </label>
            ) : (

              <label
                htmlFor={`video-upload-${name}`}
                className={`video-upload__preview-wrapper ${isEdit ? 'video-upload__preview-wrapper--locked' : ''}`}
              >

                <img
                  src={thumbnailUrl}
                  alt="Thumbnail del vídeo"
                  ref={videoRef}
                />

                {isEdit && <PadlockIcon className="video-upload__preview-wrapper__icon" />}

                <VideoDuration duration={duration} />

                {!isEdit && (
                  <button
                    type="button"
                    className="video-upload__preview-wrapper__remove-btn"
                    onClick={(e) => handleClear(e, form.setFieldValue, form.values)}
                    aria-label={VIDEO_UPLOAD_INPUT.REMOVE_ARIA}
                  >
                    <CloseIcon />
                  </button>
                )}
              </label>
            )}

            {filename && <p className="video-upload__filename">{filename}</p>}
            {meta.touched && meta.error && <p id={`video-upload-error-${name}`} className="video-upload__error">{meta.error}</p>}
          </>
        )}
      </Field>
    </div>
  )
}

export default VideoUploadInput
