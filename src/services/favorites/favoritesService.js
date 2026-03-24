import { supabase } from '../supabase/supabaseClient'

async function getUserId() {
  const { data } = await supabase.auth.getSession()
  return data?.session?.user?.id
}

export async function getFavorites() {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addFavorite(video) {
  const userId = await getUserId()
  const { error } = await supabase.from('favorites').upsert({
    user_id: userId,
    video_id: String(video.id),
    video_data: {
      id: video.id,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      pexelsUrl: video.pexelsUrl,
      photographer: video.photographer,
      photographerUrl: video.photographerUrl,
    },
  }, { onConflict: 'user_id,video_id' })
  if (error) throw error
}

export async function removeFavorite(videoId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('video_id', String(videoId))
  if (error) throw error
}
