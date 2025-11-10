import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [startTime, setStartTime] = useState('')

  async function loadEvents() {
    try {
      const res = await fetch('/api/schedule')
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setEvents(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    const payload = {
      title,
      startDate,                         // "YYYY-MM-DD" — DateOnly binds case-insensitively
      startTime: startTime ? `${startTime}:00` : null,
      description: '',
      location: '',
      isAllDay: false
    }

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Create failed')
      setTitle('')
      setStartTime('')
      await loadEvents()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Planner (React)</h1>

      <div style={{ padding: 20, maxWidth: 640 }}>
        <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
          <div>
            <label>Título</label><br />
            <input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label>Data</label><br />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit">Criar evento</button>
          </div>
        </form>

        <h2>Eventos</h2>
        <ul>
          {events.length === 0 && <li>Nenhum evento</li>}
          {events.map(ev => (
            <li key={ev.id}>
              <strong>{ev.title}</strong> — {ev.startDate}{ev.startTime ? ` ${ev.startTime}` : ''}
              {ev.location ? ` · ${ev.location}` : ''}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
