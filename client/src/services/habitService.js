import api from './api';

export const habitService = {
  async getHabits(params = {}) {
    const response = await api.get('/habits', { params });
    return response.data;
  },

  async getHabitById(id) {
    const response = await api.get(`/habits/${id}`);
    return response.data;
  },

  async createHabit(habitData) {
    const response = await api.post('/habits', habitData);
    return response.data;
  },

  async updateHabit(id, habitData) {
    const response = await api.put(`/habits/${id}`, habitData);
    return response.data;
  },

  async deleteHabit(id, archiveOnly = false) {
    const response = await api.delete(`/habits/${id}`, {
      params: { archiveOnly },
    });
    return response.data;
  },

  async completeHabit(id, date, note) {
    const response = await api.post(`/habits/${id}/complete`, { date, note });
    return response.data;
  },

  async undoCompletion(id, date) {
    const response = await api.delete(`/habits/${id}/complete/${date || ''}`);
    return response.data;
  },

  async getHabitHistory(id) {
    const response = await api.get(`/habits/${id}/history`);
    return response.data;
  },
};
