import { useEffect, useState } from 'react'

function RollingDigit({ digit, prevDigit, dir }) {
  const changed = dir && digit !== prevDigit
  return (
    <span className="stat-counter__digit">
      {changed && (
        <span className={`stat-counter__digit-value stat-counter__digit-value--out-${dir}`}>
          {prevDigit}
        </span>
      )}
      <span className={`stat-counter__digit-value${changed ? ` stat-counter__digit-value--in-${dir}` : ''}`}>
        {digit}
      </span>
    </span>
  )
}

function StatCounter({ value }) {
  const [state, setState] = useState({ curr: value, prev: value, dir: null })

  useEffect(() => {
    setState(s => {
      if (s.curr === value) return s
      return { curr: value, prev: s.curr, dir: value > s.curr ? 'up' : 'down' }
    })
  }, [value])

  const { curr, prev, dir } = state
  const currStr = String(curr)
  const prevStr = String(prev)
  const maxLen = Math.max(currStr.length, prevStr.length)
  const paddedCurr = currStr.padStart(maxLen, '0')
  const paddedPrev = prevStr.padStart(maxLen, '0')

  return (
    <span className="stat-counter" aria-label={String(curr)}>
      {paddedCurr.split('').map((digit, i) => (
        <RollingDigit
          key={i}
          digit={digit}
          prevDigit={paddedPrev[i]}
          dir={dir}
        />
      ))}
    </span>
  )
}

export default StatCounter
