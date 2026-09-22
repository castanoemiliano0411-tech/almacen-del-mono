import { useEffect, useState } from 'react'
import { DROP_AT } from '../data/products'

function pad(n) {
  return String(n).padStart(2, '0')
}

function remaining(target) {
  const diff = Math.max(0, target - Date.now())
  const sec = Math.floor(diff / 1000)
  return {
    days: pad(Math.floor(sec / 86400)),
    hours: pad(Math.floor((sec % 86400) / 3600)),
    minutes: pad(Math.floor((sec % 3600) / 60)),
    seconds: pad(sec % 60),
  }
}

export default function DropCountdown() {
  const target = new Date(DROP_AT).getTime()
  const [time, setTime] = useState(() => remaining(target))

  useEffect(() => {
    const id = window.setInterval(() => setTime(remaining(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  const units = [
    [time.days, 'Días'],
    [time.hours, 'Hrs'],
    [time.minutes, 'Min'],
    [time.seconds, 'Seg'],
  ]

  return (
    <div className="countdown">
      <span className="countdown-label">Próximo drop en</span>
      <div className="countdown-units">
        {units.map(([value, label], index) => (
          <span key={label} className="countdown-block">
            {index > 0 && <span className="countdown-sep">:</span>}
            <span className="countdown-num">{value}</span>
            <span className="countdown-unit">{label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
