import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/EventsList.css'

export default function EventsList() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadEvents() {
    try {
      setLoading(true)
      const res = await fetch('/api/schedule')
      if (!res.ok) throw new Error('Falha ao carregar eventos')
      const data = await res.json()
      setEvents(data)
      setError('')
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  async function deleteEvent(id) {
    if (!window.confirm('Tem certeza que deseja deletar este evento?')) return
    
    try {
      const res = await fetch(`/api/schedule/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao deletar evento')
      await loadEvents()
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  function formatEventDate(ev) {
    const startDate = new Date(ev.startDate).toLocaleDateString('pt-BR')
    
    // Se houver data final, mostra intervalo
    if (ev.endDate) {
      const endDate = new Date(ev.endDate).toLocaleDateString('pt-BR')
      return `📅 data para tarefa dia ${startDate} até dia ${endDate}.`
    }
    
    // Se não houver data final, mostra apenas data inicial
    return `📅 ${startDate}`
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>📋 Seus Eventos</h1>
        <button 
          className="btn-new-event"
          onClick={() => navigate('/create')}
        >
          ➕ Novo Evento
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="events-container">
        {loading ? (
          <div className="loading">Carregando eventos...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <p>Nenhum evento cadastrado</p>
            <button 
              className="btn-create-first"
              onClick={() => navigate('/create')}
            >
              Criar o primeiro evento
            </button>
          </div>
        ) : (
          <ul className="events-list">
            {events.map(ev => (
              <li key={ev.id} className="event-item">
                <div className="event-content">
                  <strong className="event-title">{ev.title}</strong>
                  <div className="event-date">
                    {formatEventDate(ev)}
                  </div>
                  {ev.description && (
                    <div className="event-description">
                      💬 {ev.description}
                    </div>
                  )}
                  {ev.location && (
                    <div className="event-location">
                      📍 {ev.location}
                    </div>
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
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}