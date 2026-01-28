import api from './api'

export interface Especialidad {
    id: number
    nombre: string
    descripcion?: string
    activo: boolean
}

export interface CreateEspecialidadPayload {
    nombre: string
    descripcion?: string
    activo?: boolean
}

const especialidadService = {
    async getEspecialidades() {
        const response = await api.get<Especialidad[]>('/especialidades/')
        return response.data
    },

    async createEspecialidad(data: CreateEspecialidadPayload) {
        const response = await api.post('/especialidades/', data)
        return response.data
    },

    async updateEspecialidad(id: number, data: Partial<CreateEspecialidadPayload>) {
        const response = await api.put(`/especialidades/${id}`, data)
        return response.data
    },

    async deleteEspecialidad(id: number) {
        const response = await api.delete(`/especialidades/${id}`)
        return response.data
    }
}

export default especialidadService
