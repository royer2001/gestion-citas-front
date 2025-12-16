import api from './api'

export interface Turno {
    id?: number
    turno: 'M' | 'T'
    turno_nombre: string
    hora_inicio: string
    hora_fin: string
    cupos: number
    area_id?: number
    area_nombre?: string
}

export interface HorarioDia {
    fecha: string
    dia_semana: number
    turnos: {
        M?: Turno
        T?: Turno
    }
}

export interface Horario {
    id?: number
    medico_id?: number
    area_id?: number
    fecha?: string
    dia_semana: number
    turno: 'M' | 'T'
    turno_nombre?: string
    hora_inicio: string
    hora_fin: string
    cupos: number
    medico_nombre?: string
    area_nombre?: string
}

export interface TurnoConfig {
    activo: boolean
    cupos: number
}

export interface CrearHorariosMensualesPayload {
    medico_id: number
    area_id: number
    mes: string  // YYYY-MM
    dias_seleccionados: string[]  // Array de fechas YYYY-MM-DD
    turnos: {
        manana: TurnoConfig
        tarde: TurnoConfig
    }
}

export interface ResumenMes {
    medico_id: number
    mes: string
    dias: HorarioDia[]
}

const horarioService = {
    // Crear horarios para todo el mes
    crearHorariosMensuales(payload: CrearHorariosMensualesPayload) {
        return api.post('/horarios/mensual', payload)
    },

    // Obtener horarios con filtros
    getHorarios(params?: {
        medico_id?: number | null
        area_id?: number | null
        mes?: string
        fecha?: string
        turno?: 'M' | 'T'
    }) {
        return api.get<Horario[]>('/horarios/', { params })
    },

    // Obtener resumen del mes para calendario
    getResumenMes(medico_id: number, mes: string) {
        return api.get<ResumenMes>('/horarios/resumen', {
            params: { medico_id, mes }
        })
    },

    // Obtener horarios de un área
    getHorariosArea(areaId: number) {
        return api.get(`/horarios/area/${areaId}`)
    },

    // Obtener horarios de un médico
    getHorariosMedico(medicoId: number) {
        return api.get(`/horarios/medico/${medicoId}`)
    },

    // Eliminar un horario específico
    eliminarHorario(id: number) {
        return api.delete(`/horarios/${id}`)
    },

    // Actualizar un horario específico (cupos, area_id)
    actualizarHorario(id: number, data: { cupos?: number; area_id?: number }) {
        return api.put(`/horarios/${id}`, data)
    },

    // Eliminar horarios de un mes
    eliminarHorariosMes(medico_id: number, mes: string, turno?: 'M' | 'T') {
        return api.delete('/horarios/mensual', {
            params: { medico_id, mes, turno }
        })
    },

    // Crear horarios en bloque (bulk)
    crearHorariosBulk(payload: {
        medico_id: number
        area_id: number
        mes: string
        dias_semana: number[]
        turnos: { turno: string; cupos: number }[]
    }) {
        return api.post('/horarios/bulk', payload)
    },

    // Crear horario individual (legacy compatible)
    crearHorario(data: Horario | Horario[]) {
        return api.post('/horarios/', data)
    }
}

export default horarioService
