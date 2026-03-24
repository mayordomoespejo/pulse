import { supabase } from '../supabase/supabaseClient'

/**
 * Sends an OTP code to the given email address.
 * Creates the user if they don't exist yet.
 */
export async function sendOtp(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  })
  if (error) throw error
}

/**
 * Verifies the OTP token sent to the given email.
 * Returns the session data on success.
 */
export async function verifyOtp(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  if (error) throw error
  return data
}

/**
 * Signs the current user out.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Initiates Google OAuth sign-in flow.
 * Redirects the user to Google's consent screen.
 */
export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      skipBrowserRedirect: true,
      queryParams: { prompt: 'select_account' },
    },
  })
  if (error) throw error

  window.open(data.url, 'google-oauth', 'width=500,height=600,left=400,top=150')
}
