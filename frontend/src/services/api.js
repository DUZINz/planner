import { API_URL } from '../config';

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/api/schedule`);
  if (!response.ok) {
    throw new Error('Falha ao buscar eventos');
  }
  return response.json();
};

export const createEvent = async (eventData) => {
  console.log('🔍 API_URL:', API_URL); // ⬅️ ADICIONE ESTE LOG
  console.log('📤 Enviando:', eventData); // ⬅️ ADICIONE ESTE LOG
  
  const response = await fetch(`${API_URL}/api/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  
  console.log('📥 Response status:', response.status); // ⬅️ ADICIONE ESTE LOG
  
  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Erro:', error); // ⬅️ ADICIONE ESTE LOG
    throw new Error('Falha ao criar evento');
  }
  
  return response.json();
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_URL}/api/schedule/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Falha ao deletar evento');
  }
};