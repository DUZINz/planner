import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config' // ⬅️ ADICIONE ESTE IMPORT
import '../styles/CreateEvent.css'

export default function CreateEvent() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [error, setError] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    
    const payload = {
      title,
      description,
      location,
      startDate: `${startDate}T00:00:00`, // ⬅️ ADICIONE HORA
      startTime: startTime ? `${startTime}:00` : null,
      endDate: endDate ? `${endDate}T23:59:59` : null, // ⬅️ ADICIONE HORA
      endTime: endTime ? `${endTime}:00` : null,
      isAllDay: false
    }

    console.log('🔍 API_URL:', API_URL) // ⬅️ DEBUG
    console.log('📤 Enviando:', payload) // ⬅️ DEBUG

    try {
      const res = await fetch(`${API_URL}/api/schedule`, { // ⬅️ USE API_URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      console.log('📥 Status:', res.status) // ⬅️ DEBUG
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('❌ Erro:', errorText) // ⬅️ DEBUG
        throw new Error('Falha ao criar evento')
      }
      
      setTitle('')
      setDescription('')
      setLocation('')
      setStartTime('')
      setEndDate('')
      setEndTime('')
      setStartDate(new Date().toISOString().slice(0, 10))
      
      navigate('/events')
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  return (
    <div className="create-page">
      <div className="create-container">
        <h1>📅 Criar Novo Evento</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleCreate} className="form-card">
          <div className="form-group">
            <label>Título do evento *</label>
            <input 
              type="text"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Reunião com time"
              required 
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Detalhes adicionais..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Data inicial *</label>
            <div className="form-row">
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Data final</label>
            <div className="form-row">
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-create">
              ➕ Criar evento
            </button>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/events')}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}