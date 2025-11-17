import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import '../styles/CreateEvent.css'

export default function CreateEvent() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await api.createEvent(formData)
      alert('Evento criado com sucesso!')
      navigate('/events')
    } catch (err) {
      alert('Erro ao criar evento')
      console.error('Erro ao criar evento:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="create-event">
      <h1>Criar Novo Evento</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            name="title"
            placeholder="Digite o título"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            name="description"
            placeholder="Digite a descrição"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Data/Hora Início</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Data/Hora Fim</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Evento'}
        </button>
        
        <button type="button" onClick={() => navigate('/events')}>
          Cancelar
        </button>
      </form>
    </div>
  )
}