import { useEffect, useRef, useState } from 'react'

import GradientBar from './GradientBar'

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const lerp = (a, b, t) => a + (b - a) * t
const easeInQuad = (t) => t * t
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

function ProgressGradient({
  className = '',
  isLoading = false,
  width = 27,
  height = 300,
  gradientDuration = 6,
}) {
  const loadingCap = 96
  const longLoadCap = 98.5
  const longLoadAfterMs = 16000
  const nearEndCrawlFrom = 94
  const stallChance = 0.45
  const stallMinMs = 200
  const stallMaxMs = 900
  const rafRef = useRef(null)
  const lastTimeRef = useRef(0)

  const startTimeRef = useRef(0)
  const elapsedRef = useRef(0)

  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)

  const stallUntilRef = useRef(0)
  const nextStallCheckAtRef = useRef(0)

  const prevLoadingRef = useRef(false)

  useEffect(() => {
    if (isLoading && !prevLoadingRef.current) {
      if (progressRef.current >= 99.5 || progressRef.current === 0) {
        progressRef.current = 0
        setProgress(0)
      }
      startTimeRef.current = performance.now()
      elapsedRef.current = 0
      stallUntilRef.current = 0
      nextStallCheckAtRef.current = 0
    }

    prevLoadingRef.current = isLoading

    const tick = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const dt = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      if (!startTimeRef.current) startTimeRef.current = time
      elapsedRef.current = time - startTimeRef.current

      const p = progressRef.current

      if (!isLoading) {
        const kFinish = 8.5
        progressRef.current = p + (100 - p) * (1 - Math.exp(-kFinish * dt))
        const next = Math.round(progressRef.current)
        setProgress(next)

        if (progressRef.current < 99.95) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          progressRef.current = 100
          setProgress(100)
        }
        return
      }

      const t01 = clamp(elapsedRef.current / 12000, 0, 1)
      const capBase = lerp(82, loadingCap, easeOutCubic(t01))

      const cap =
        elapsedRef.current >= longLoadAfterMs
          ? Math.max(capBase, longLoadCap)
          : capBase

      const accel01 = clamp(elapsedRef.current / 9000, 0, 1)
      let k = lerp(0.18, 1.35, easeInQuad(accel01))

      const nowMs = elapsedRef.current
      const canStall = p >= 55 && p < cap - 1

      if (canStall) {
        if (nowMs < stallUntilRef.current) {
          k *= 0.05
        } else {
          if (nowMs >= nextStallCheckAtRef.current) {
            const nearEnd = p >= nearEndCrawlFrom
            const chance = nearEnd ? stallChance * 0.6 : stallChance

            if (Math.random() < chance) {
              const dur = lerp(stallMinMs, stallMaxMs, Math.random())
              stallUntilRef.current = nowMs + dur
            }

            nextStallCheckAtRef.current = nowMs + lerp(700, 1600, Math.random())
          }
        }
      }

      if (p >= nearEndCrawlFrom) {
        k *= 0.55
      }

      progressRef.current = p + (cap - p) * (1 - Math.exp(-k * dt))

      progressRef.current = Math.min(progressRef.current, cap)

      setProgress(Math.round(progressRef.current))

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTimeRef.current = 0
    }
  }, [isLoading])

  const isHidden = !isLoading && progress >= 100

  return (
    <div
      className={`progress-gradient ${isHidden ? 'progress-gradient--hidden' : ''} ${className}`}
      aria-hidden={isHidden}
    >
      <div className="progress-gradient__value">{progress}%</div>
      <GradientBar width={width} height={height} duration={gradientDuration} />
    </div>
  )
}

export default ProgressGradient
