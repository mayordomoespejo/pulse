const DEMO_USERNAME = import.meta.env.VITE_DEMO_USERNAME || 'demo@pulse.dev'
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || 'Pulse123!'

/**
 * Simulates login against demo credentials for portfolio preview.
 *
 * @param {Object} credentials User credentials.
 * @param {string} credentials.username Username/email.
 * @param {string} credentials.password Password.
 * @returns {Promise<{data: {accessToken: string}}>} Mock access token payload.
 */
export async function loginService({ username, password }) {
  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    return Promise.resolve({
      data: {
        accessToken: `demo-token-${Date.now()}`,
      },
    })
  }

  return Promise.reject({
    status: 401,
    response: {
      data: {
        errorKey: 'LOGIN.ERRORS.INVALID_DEMO',
      },
    },
  })
}

export default loginService
