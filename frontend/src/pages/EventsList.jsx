import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config' // ⬅️ IMPORTANTE!
import '../styles/EventsList.css'

export default function EventsList() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      setLoading(true)
      setError('')
      
      console.log('🔍 API_URL:', API_URL) // ⬅️ DEBUG
      
      const res = await fetch(`${API_URL}/api/schedule`) // ⬅️ USE API_URL
      
      console.log('📥 Status:', res.status) // ⬅️ DEBUG
      
      if (!res.ok) {
        throw new Error('Falha ao carregar eventos')
      }
      
      const data = await res.json()
      console.log('✅ Eventos:', data) // ⬅️ DEBUG
      
      setEvents(data)
    } catch (err) {
      console.error('❌ Erro:', err)
      setError('Falha ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deseja realmente deletar este evento?')) {
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/schedule/${id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) {
        throw new Error('Falha ao deletar evento')
      }
      
      await loadEvents()
    } catch (err) {
      console.error(err)
      alert('Erro ao deletar evento')
    }
  }

  if (loading) {
    return (
      <div className="events-page">
        <div className="loading">Carregando eventos...</div>
      </div>
    )
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>📅 Meus Eventos</h1>
        <button 
          className="btn-new-event"
          onClick={() => navigate('/create')}
        >
          ➕ Criar Novo Evento
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <p>Nenhum evento cadastrado</p>
          <button 
            className="btn-create-first"
            onClick={() => navigate('/create')}
          >
            Criar o primeiro evento
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.title}</h3>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(event.id)}
                  title="Deletar evento"
                >
                  🗑️
                </button>
              </div>

              {event.description && (
                <p className="event-description">{event.description}</p>
              )}

              <div className="event-date">
                <span className="date-icon">📅</span>
                <span>{event.startDate}</span>
                {event.startTime && <span className="time">às {event.startTime}</span>}
              </div>

              {event.endDate && (
                <div className="event-date">
                  <span className="date-icon">🏁</span>
                  <span>{event.endDate}</span>
                  {event.endTime && <span className="time">às {event.endTime}</span>}
                </div>
              )}

              {event.location && (
                <div className="event-location">
                  <span className="location-icon">📍</span>
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}