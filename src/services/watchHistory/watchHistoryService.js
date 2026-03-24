import { supabase } from '../supabase/supabaseClient'

async function getUserId() {
  const { data } = await supabase.auth.getSession()
  return data?.session?.user?.id
}

export async function getWatchHistory(limit = 10) {
  const { data, error } = await supabase
    .from('watch_history')
    .select('*')
    .order('watched_at', { ascending: false })
    .limit(limit * 5) // fetch 5× the desired limit so deduplication by video_id still yields enough unique entries
  if (error) throw error

  const seen = new Set()
  return data
    .filter((entry) => {
      if (seen.has(entry.video_id)) return false
      seen.add(entry.video_id)
      return true
    })
    .slice(0, limit)
}

export async function addToHistory(video) {
  const userId = await getUserId()
  if (!userId) return
  const videoId = String(video.id)
  // Delete existing entry so watched_at is always fresh
  try {
    await supabase.from('watch_history').delete().eq('user_id', userId).eq('video_id', videoId)
  } catch {
    // Non-fatal: if delete fails, proceed with insert anyway
  }
  const { error } = await supabase.from('watch_history').insert({
    user_id: userId,
    video_id: videoId,
    video_data: {
      id: video.id,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      pexelsUrl: video.pexelsUrl,
      photographer: video.photographer,
      photographerUrl: video.photographerUrl,
    },
  })
  if (error) throw error
}
