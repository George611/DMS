import api from './axios';

export const volunteerApi = {
    getAll: () => api.get('/volunteers'),
    getById: (id) => api.get(`/volunteers/${id}`),
    create: (data) => api.post('/volunteers', data),
    update: (id, data) => api.put(`/volunteers/${id}`, data),
    delete: (id) => api.delete(`/volunteers/${id}`)
};

export default volunteerApi;
