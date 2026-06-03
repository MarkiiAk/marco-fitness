'use client'

import { useEffect, useState } from 'react'

export default function LiveClock() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('es-MX', {
          timeZone: 'America/Mexico_City',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
    }
    update()
    const id = setInterval(update, 10_000)
    return () => clearInterval(id)
  }, [])

  if (!time) return null

  return (
    <span
      className="text-sm font-medium text-zinc-400 tabular-nums"
      style={{ fontFamily: 'var(--font-geist-mono)' }}
    >
      {time}
    </span>
  )
}
