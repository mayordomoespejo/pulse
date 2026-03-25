import { auth } from '../firebase/firebaseClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ENDPOINT = `${SUPABASE_URL}/functions/v1/watch-history`;

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

export async function getWatchHistory(_userId) {
  const token = await getToken();
  const res = await fetch(ENDPOINT, {
    method: 'GET',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`getWatchHistory failed: ${res.status}`);
  return res.json();
}

export async function addToHistory(_userId, video) {
  const token = await getToken();
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ video_id: String(video.id), video_data: video }),
  });
  if (!res.ok) throw new Error(`addToHistory failed: ${res.status}`);
}

export async function clearHistory(_userId) {
  const token = await getToken();
  const res = await fetch(ENDPOINT, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`clearHistory failed: ${res.status}`);
}
