import { supabase } from '../services/supabase/supabaseClient'

const ACCESS_TOKEN_KEY = 'accessToken'

export function getToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    return localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
  return localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}

export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}

export default {
  getToken,
  setToken,
  clearToken,
  isAuthenticated,
  getUser,
}
