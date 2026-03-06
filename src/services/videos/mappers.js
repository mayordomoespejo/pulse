const QUALITY_PRIORITY = {
  hd: 3,
  sd: 2,
  hls: 1,
}

function scoreVideoFile(file) {
  const qualityScore = QUALITY_PRIORITY[file?.quality] ?? 0
  const widthScore = Number(file?.width) || 0
  return qualityScore * 100000 + widthScore
}

function selectPlaybackUrl(videoFiles = []) {
  const mp4Files = videoFiles.filter((file) => file?.file_type === 'video/mp4' && Boolean(file?.link))

  if (mp4Files.length === 0) {
    return null
  }

  return mp4Files.sort((a, b) => scoreVideoFile(b) - scoreVideoFile(a))[0]?.link ?? null
}

function mapPlaybackSources(videoFiles = []) {
  const mp4Files = videoFiles.filter((file) => file?.file_type === 'video/mp4' && Boolean(file?.link))

  return mp4Files
    .map((file) => ({
      id: String(file?.id ?? file?.link),
      quality: file?.quality || 'unknown',
      width: Number(file?.width) || 0,
      height: Number(file?.height) || 0,
      fps: Number(file?.fps) || null,
      link: file?.link,
    }))
    .sort((a, b) => scoreVideoFile(b) - scoreVideoFile(a))
}

function extractTitleFromUrl(url, fallbackId) {
  if (!url) {
    return `Pexels video ${fallbackId}`
  }

  const segments = url.split('/').filter(Boolean)
  const slug = segments[segments.length - 1] || ''
  const cleaned = slug.replace(/-\d+$/, '').replace(/-/g, ' ').trim()

  if (!cleaned) {
    return `Pexels video ${fallbackId}`
  }

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

export function mapPexelsVideo(video) {
  const id = String(video?.id ?? '')
  const sources = mapPlaybackSources(video?.video_files)

  return {
    id,
    title: extractTitleFromUrl(video?.url, id),
    duration: Number(video?.duration) || 0,
    thumbnailUrl: video?.image || null,
    url: selectPlaybackUrl(video?.video_files),
    playbackSources: sources,
    pexelsUrl: video?.url || null,
    photographer: video?.user?.name || 'Unknown author',
    photographerUrl: video?.user?.url || 'https://www.pexels.com',
    tags: [],
    width: Number(video?.width) || null,
    height: Number(video?.height) || null,
  }
}

export function mapPexelsListResponse(payload) {
  const page = Number(payload?.page) || 1
  const perPage = Number(payload?.per_page) || 15
  const totalResults = Number(payload?.total_results) || 0
  const pagesCount = totalResults > 0 ? Math.ceil(totalResults / perPage) : 1

  return {
    videos: Array.isArray(payload?.videos) ? payload.videos.map(mapPexelsVideo) : [],
    page,
    perPage,
    pagesCount,
    totalVideos: totalResults,
    nextPage: payload?.next_page || null,
    prevPage: payload?.prev_page || null,
  }
}
