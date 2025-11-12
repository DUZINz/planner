import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/EventsList.css'

export default function EventsList() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)

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
    
    if (ev.endDate) {
      const endDate = new Date(ev.endDate).toLocaleDateString('pt-BR')
      return `📅 data para tarefa dia ${startDate} até dia ${endDate}.`
    }
    
    return `📅 tarefa para ser executada até dia ${startDate}.`
  }

  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>📋 Suas Tarefas</h1>
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
              <li 
                key={ev.id} 
                className={`event-item ${expandedId === ev.id ? 'expanded' : ''}`}
              >
                <button
                  className="event-button"
                  onClick={() => toggleExpand(ev.id)}
                >
                  <div className="event-content">
                    <strong className="event-title">{ev.title}</strong>
                    <div className="event-date">
                      {formatEventDate(ev)}
                    </div>
                    {ev.location && (
                      <div className="event-location">
                        📍 {ev.location}
                      </div>
                    )}
                  </div>
                  <span className="expand-icon">
                    {expandedId === ev.id ? '▼' : '▶'}
                  </span>
                </button>

                {expandedId === ev.id && (
                  <div className="event-details">
                    {ev.description && (
                      <div className="event-description">
                        <strong>Descrição:</strong>
                        <p>{ev.description}</p>
                      </div>
                    )}
                    <button 
                      className="btn-delete" 
                      onClick={() => deleteEvent(ev.id)}
                      title="Deletar evento"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                )}

                {expandedId !== ev.id && (
                  <button 
                    className="btn-delete-inline" 
                    onClick={() => deleteEvent(ev.id)}
                    title="Deletar evento"
                  >
                    🗑️ Deletar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}