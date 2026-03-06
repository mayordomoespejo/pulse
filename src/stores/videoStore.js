import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import createPlayerSlice from './createPlayerSlice'

/**
 * @typedef {import('./createPlayerSlice').PlayerSliceState} VideoStore
 */

/**
 * Store principal de video.
 *
 * @returns {VideoStore} 
 */

/** @type {() => VideoStore} */
const useVideoStore = create(
  persist(
    (...args) => ({
      ...createPlayerSlice(...args),
    }),
    {
      name: 'video-store',
    }
  )
)

export default useVideoStore
