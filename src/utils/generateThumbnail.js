export const generateThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')

    video.preload = 'metadata'
    video.src = url
    video.crossOrigin = 'anonymous'
    video.muted = true

    video.addEventListener('loadedmetadata', () => {
      const midTime = video.duration * 0.25
      video.currentTime = midTime
    })

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        const thumbUrl = URL.createObjectURL(blob)
        resolve({ blob, url: thumbUrl })
        // Revoke only the video URL
        URL.revokeObjectURL(url)
      }, 'image/jpeg')
    })

    video.onerror = () => reject(new Error('Error al cargar el vídeo'))
  })
}
