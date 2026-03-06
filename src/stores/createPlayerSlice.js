/**
 * @typedef {Object} PlayerSliceState
 * @property {Object|null} currentPlaylist - Playlist actual
 * @property {Object|null} currentVideo - Video actual
 * @property {Object|null} prevVideo - Video anterior
 * @property {Object|null} nextVideo - Siguiente video
 * @property {number} volume - Volumen global del reproductor (0–1)
 * @property {Function} setVolume - Establece el volumen
 * @property {boolean} autoFullscreen - Auto activar pantalla completa
 * @property {Function} setCurrentPlaylist - Establece la playlist actual
 * @property {Function} setCurrentVideo - Establece el video actual y actualiza los videos anterior y siguiente
 * @property {Function} setAutoFullscreen - Establece auto pantalla completa
 * @property {Function} onPrevVideo - Navega al video anterior en la playlist
 * @property {Function} onNextVideo - Navega al siguiente video en la playlist
 * @property {Function} onResetPlaylist - Reinicia la playlist al primer video
 */

const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, Number(n)))

const createPlayerSlice = (set, get) => ({
  currentPlaylist: get()?.currentPlaylist || null,
  currentVideo: get()?.currentPlaylist?.playlistItems[0] || null,
  prevVideo: get()?.currentPlaylist?.playlistItems[0] || null,
  nextVideo: get()?.currentPlaylist?.playlistItems[1] || null,

  volume: 0.8,
  setVolume: (v) => set({ volume: clamp(v) }),

  autoFullscreen: false,
  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
  setCurrentVideo: (video) => {
    const currentPlaylist = get().currentPlaylist?.playlistItems || []
    const currentIndex = currentPlaylist.findIndex(item => item?.video?.id === video?.video?.id)

    const allowNext = currentIndex < currentPlaylist.length - 1
    const nextVideo = allowNext ? currentPlaylist[currentIndex + 1] : null

    const allowPrev = currentIndex > 0
    const prevVideo = allowPrev ? currentPlaylist[currentIndex - 1] : null

    set({ currentVideo: { ...video, currentIndex }, prevVideo, nextVideo })
  },
  setAutoFullscreen: (value) => set({ autoFullscreen: Boolean(value) }),
  onPrevVideo: () => {
    const { currentVideo, setCurrentVideo } = get()
    const currentIndex = currentVideo.currentIndex - 1
    const playlist = get().currentPlaylist?.playlistItems || []
    const prevVideo = playlist[currentIndex]
    setCurrentVideo(prevVideo)
  },
  onNextVideo: () => {
    const { currentVideo, setCurrentVideo } = get()
    const currentIndex = currentVideo.currentIndex + 1
    const playlist = get().currentPlaylist?.playlistItems || []
    const nextVideo = playlist[currentIndex]
    setCurrentVideo(nextVideo)
  },
  onResetPlaylist: () => {
    const { currentPlaylist, setCurrentVideo } = get()
    const video = currentPlaylist?.playlistItems[0]
    setCurrentVideo(video)
  }
})

export default createPlayerSlice
