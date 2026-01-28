import api from './api';

export interface Manual {
  id: number;
  nombre: string;
  descripcion: string;
  url_drive: string;
  rol_id: number | null;
  rol_nombre?: string;
}

export const manualService = {
  getManuales() {
    return api.get<Manual[]>('/manuales');
  },

  getManualesPorRol(rolId: number) {
    return api.get<Manual[]>(`/manuales/rol/${rolId}`);
  },

  createManual(manual: Partial<Manual>) {
    return api.post('/manuales/', manual);
  },

  updateManual(id: number, manual: Partial<Manual>) {
    return api.put(`/manuales/${id}`, manual);
  },

  deleteManual(id: number) {
    return api.delete(`/manuales/${id}`);
  }
};
