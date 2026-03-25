import { auth } from '../firebase/firebaseClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ENDPOINT = `${SUPABASE_URL}/functions/v1/favorites`;

async function getToken() {
  const token = await auth.currentUser.getIdToken();
  return token;
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function getFavorites(_userId) {
  const token = await getToken();
  const res = await fetch(ENDPOINT, {
    method: 'GET',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`getFavorites failed: ${res.status}`);
  return res.json();
}

export async function addFavorite(_userId, video) {
  const token = await getToken();
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ video_id: String(video.id), video_data: video }),
  });
  if (!res.ok) throw new Error(`addFavorite failed: ${res.status}`);
}

export async function removeFavorite(_userId, videoId) {
  const token = await getToken();
  const res = await fetch(`${ENDPOINT}?video_id=${encodeURIComponent(String(videoId))}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`removeFavorite failed: ${res.status}`);
}

export async function clearFavorites(_userId) {
  const favorites = await getFavorites(_userId);
  await Promise.all(favorites.map((f) => removeFavorite(_userId, f.video_id)));
}

export async function isFavorite(_userId, videoId) {
  const favorites = await getFavorites(_userId);
  return favorites.some((f) => f.video_id === String(videoId));
}
