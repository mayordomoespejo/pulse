/**
 * @typedef {Object} PlayerSliceState
 * @property {Object|null} currentPlaylist - Active playlist
 * @property {Object|null} currentVideo - Currently playing video item
 * @property {Object|null} prevVideo - Previous video item in the playlist
 * @property {Object|null} nextVideo - Next video item in the playlist
 * @property {number} volume - Global player volume (0–1)
 * @property {Function} setVolume - Set the player volume
 * @property {boolean} autoFullscreen - Whether to auto-enter fullscreen on play
 * @property {Function} setCurrentPlaylist - Set the active playlist
 * @property {Function} setCurrentVideo - Set the current video and update prev/next
 * @property {Function} setAutoFullscreen - Toggle auto-fullscreen
 * @property {Function} onPrevVideo - Navigate to the previous video
 * @property {Function} onNextVideo - Navigate to the next video
 * @property {Function} onResetPlaylist - Reset the playlist to the first video
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
