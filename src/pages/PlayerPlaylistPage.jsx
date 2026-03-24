import { useQuery } from '@tanstack/react-query'
import { MediaProvider } from 'media-chrome/react/media-store'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import PlayerVideo from '../components/player/PlayerVideo'
import Heading from '../components/ui/Heading'
import ProgressGradient from '../components/ui/ProgressGradient'
import TitleCard from '../components/ui/TitleCard'
import { ROUTES_NAMES } from '../router/routesNames'
import { useWatchHistory } from '../hooks/useWatchHistory'
import { getVideo } from '../services/videos/getVideo'
import useVideoStore from '../stores/videoStore'

/**
 * Video detail page with embedded player and attribution.
 *
 * @returns {JSX.Element}
 */
function PlayerPlaylistPage() {
  const { t } = useTranslation()
  const TITLE = t('TITLE', { returnObjects: true })
  const PEXELS = t('PEXELS', { returnObjects: true })
  const { videoId } = useParams()
  const navigate = useNavigate()
  const { currentPlaylist, currentVideo, setCurrentPlaylist, setCurrentVideo } = useVideoStore()
  const { addToHistory } = useWatchHistory()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => getVideo(videoId),
    enabled: Boolean(videoId),
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isError) {
      navigate(ROUTES_NAMES.NOT_FOUND)
    }
  }, [isError, navigate])

  const video = data?.data

  useEffect(() => {
    if (!video) return

    const playlistLike = {
      id: `pexels-video-${video.id}`,
      name: video.title,
      playlistItems: [{ id: `item-${video.id}`, video }],
    }

    setCurrentPlaylist(playlistLike)
    setCurrentVideo(playlistLike.playlistItems[0])
    addToHistory(video) // fire-and-forget
  }, [video, setCurrentPlaylist, setCurrentVideo]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!video?.title) return
    const previousTitle = document.title
    document.title = `${video.title} | ${TITLE.MAIN}`

    return () => {
      document.title = previousTitle
    }
  }, [video?.title, TITLE.MAIN])

  if (isLoading) {
    return <ProgressGradient className="player-play-list-page__progress" isLoading />
  }

  return (
    <div className="player-play-list-page">
      <div className="player-play-list-page__header">
        <Heading title={currentPlaylist?.name || video?.title || t('ERROR.TITLE')} as="h2" back />
      </div>

      <div className="player-play-list-page__main">
        <MediaProvider>
          <div className="player-play-list-page__player-section">
            <PlayerVideo />
            <div className="player-play-list-page__player-info">
              <TitleCard
                className="player-play-list-page__title"
                title={currentVideo?.video?.title}
                tags={currentVideo?.video?.tags}
              />

              <p className="player-play-list-page__credits">
                {PEXELS.VIDEO_BY}{' '}
                <a href={currentVideo?.video?.photographerUrl} target="_blank" rel="noreferrer">
                  {currentVideo?.video?.photographer}
                </a>{' '}{PEXELS.ON}{' '}
                <a href={currentVideo?.video?.pexelsUrl} target="_blank" rel="noreferrer">
                  {PEXELS.BRAND}
                </a>
              </p>
            </div>
          </div>
        </MediaProvider>
      </div>
    </div>
  )
}

export default PlayerPlaylistPage
