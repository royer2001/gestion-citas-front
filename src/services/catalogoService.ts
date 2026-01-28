import api from './api'

export interface EstadoCita {
    id: number
    nombre: string
    descripcion: string
    color: string
    activo: boolean
}

const catalogoService = {
    getEstadosCita() {
        return api.get<EstadoCita[]>('/catalogos/estados-cita')
    }
}

export default catalogoService
