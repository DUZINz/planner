import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import '../styles/EventsList.css'

export default function EventsList() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      setLoading(true)
      setError('')
      
      const res = await fetch(`${API_URL}/api/schedule`)
      
      if (!res.ok) {
        throw new Error('Falha ao carregar eventos')
      }
      
      const data = await res.json()
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

  // Funções do Calendário
  function getDaysInMonth(date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  function getEventsForDate(date) {
    if (!date) return []
    
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => event.startDate === dateStr)
  }

  function changeMonth(offset) {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + offset)
      return newDate
    })
  }

  function isToday(date) {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  function isSameDate(date1, date2) {
    if (!date1 || !date2) return false
    return date1.toDateString() === date2.toDateString()
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const days = getDaysInMonth(currentDate)
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  if (loading) {
    return (
      <div className="calendar-page">
        <div className="loading">📅 Carregando calendário...</div>
      </div>
    )
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>📅 Calendário de Eventos</h1>
        <button 
          className="btn-new-event"
          onClick={() => navigate('/create')}
        >
          ➕ Novo Evento
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="calendar-container">
        {/* Navegação do Mês */}
        <div className="calendar-nav">
          <button onClick={() => changeMonth(-1)}>◀ Anterior</button>
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={() => changeMonth(1)}>Próximo ▶</button>
        </div>

        {/* Dias da Semana */}
        <div className="calendar-weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        {/* Grid de Dias */}
        <div className="calendar-grid">
          {days.map((date, index) => {
            const dayEvents = date ? getEventsForDate(date) : []
            const hasEvents = dayEvents.length > 0
            
            return (
              <div
                key={index}
                className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSameDate(date, selectedDate) ? 'selected' : ''} ${hasEvents ? 'has-events' : ''}`}
                onClick={() => date && setSelectedDate(date)}
              >
                {date && (
                  <>
                    <span className="day-number">{date.getDate()}</span>
                    {hasEvents && (
                      <div className="event-indicators">
                        {dayEvents.map((event, idx) => (
                          <span key={idx} className="event-dot" title={event.title}>•</span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Lista de Eventos do Dia Selecionado */}
      {selectedDate && (
        <div className="selected-day-events">
          <h3>
            📅 Eventos de {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
          </h3>
          
          {selectedEvents.length === 0 ? (
            <p className="no-events-day">Nenhum evento neste dia</p>
          ) : (
            <div className="day-events-list">
              {selectedEvents.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-item-header">
                    <h4>{event.title}</h4>
                    <button 
                      className="btn-delete-small"
                      onClick={() => handleDelete(event.id)}
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  {event.description && (
                    <p className="event-item-desc">{event.description}</p>
                  )}
                  
                  {event.startTime && (
                    <p className="event-item-time">🕐 {event.startTime}</p>
                  )}
                  
                  {event.location && (
                    <p className="event-item-location">📍 {event.location}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}