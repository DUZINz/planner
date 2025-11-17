import config from '../config';

const API_BASE_URL = config.apiUrl;

export const api = {
  async getEvents() {
    const response = await fetch(`${API_BASE_URL}/api/schedule`);
    if (!response.ok) throw new Error('Erro ao buscar eventos');
    return response.json();
  },

  async createEvent(event) {
    const response = await fetch(`${API_BASE_URL}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Erro ao criar evento');
    return response.json();
  },

  async deleteEvent(id) {
    const response = await fetch(`${API_BASE_URL}/api/schedule/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar evento');
    return response.json();
  }
};