import api from './api'

export interface EstadoCita {
    id: number
    nombre: string
    descripcion: string
    color: string
    activo: boolean
}

export interface Especialidad {
    id: number
    nombre: string
    descripcion?: string
    activo: boolean
}

const catalogoService = {
    getEstadosCita() {
        return api.get<EstadoCita[]>('/catalogos/estados-cita')
    },
    getEspecialidades() {
        return api.get<Especialidad[]>('/catalogos/especialidades')
    }
}

export default catalogoService
