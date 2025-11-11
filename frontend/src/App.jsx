import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export default function App() {
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')

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
      description,
      location,
      startDate,
      startTime: startTime ? `${startTime}:00` : null,
      endDate: endDate || null,
      endTime: endTime ? `${endTime}:00` : null,
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
      setDescription('')
      setLocation('')
      setStartTime('')
      setEndDate('')
      setEndTime('')
      setStartDate(new Date().toISOString().slice(0, 10))
      await loadEvents()
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteEvent(id) {
    try {
      await fetch(`/api/schedule/${id}`, { method: 'DELETE' })
      await loadEvents()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="header-logos">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} alt="React logo" />
        </a>
      </div>

      <h1>📅 Planner</h1>

      <div className="container">
        <div className="form-card">
          <form onSubmit={handleCreate}>
            <label>Título do evento *</label>
            <input 
              type="text"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Reunião com time"
              required 
            />

            <label>Descrição</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Detalhes adicionais..."
              rows="3"
            />
            <label>Data inicial *</label>
            <div className="form-row">
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                required 
              />
              <input 
                type="time" 
                value={startTime} 
                onChange={e => setStartTime(e.target.value)} 
                placeholder="Hora"
              />
            </div>

            <label>Data final</label>
            <div className="form-row">
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
              />
              <input 
                type="time" 
                value={endTime} 
                onChange={e => setEndTime(e.target.value)} 
                placeholder="Hora"
              />
            </div>

            <button type="submit" className="btn-create">
              ➕ Criar evento
            </button>
          </form>
        </div>

        <div className="events-section">
          <h2>📋 Seus eventos</h2>
          <ul className="events-list">
            {events.length === 0 ? (
              <li className="empty-state">
                <div className="empty-state-icon">🎯</div>
                <p>Nenhum evento cadastrado. Crie um novo!</p>
              </li>
            ) : (
              events.map(ev => (
                <li key={ev.id}>
                  <div className="event-content">
                    <strong>{ev.title}</strong>
                    <div className="event-date">
                      📅 {new Date(ev.startDate).toLocaleDateString('pt-BR')}
                      {ev.startTime && ` às ${ev.startTime.slice(0, 5)}`}
                    </div>
                    {ev.description && (
                      <div className="event-description">💬 {ev.description}</div>
                    )}
                    {ev.location && (
                      <div className="event-location">📍 {ev.location}</div>
                    )}
                  </div>
                  <button 
                    className="btn-delete" 
                    onClick={() => deleteEvent(ev.id)}
                    title="Deletar evento"
                  >
                    🗑️ Deletar
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  )
}
