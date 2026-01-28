import api from './api'

// Interfaces para pacientes
export interface Paciente {
    id: number
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    dni: string
    telefono?: string | null
    email?: string | null
    fecha_nacimiento?: string | null
    sexo?: string
    direccion?: string
    seguro?: string | null
}

// Interfaces para horarios
export interface Horario {
    id: number
    turno: 'M' | 'T'
    turno_nombre: string
    hora_inicio: string
    hora_fin: string
    cupos?: number
}

// Interface para Cita completa
export interface Cita {
    id: number
    paciente_id: number
    horario_id: number | null
    doctor_id: number | null
    area_id: number | null
    area: string | null
    area_nombre: string | null
    fecha: string | null          // Fecha de la cita (YYYY-MM-DD)
    fecha_registro: string        // Cuando se registró
    sintomas: string
    estado: string
    doctor_nombre: string | null
    horario_turno: 'M' | 'T' | null
    horario_turno_nombre: string | null
    dni_acompanante: string | null
    nombre_acompanante: string | null
    telefono_acompanante: string | null
    datos_adicionales: Record<string, unknown> | null
    paciente?: Paciente
    horario?: Horario
    estado_info?: {
        id: number
        nombre: string
        descripcion: string
        color: string
    }
}

// Payload para crear citas
export interface CrearCitaPayload {
    paciente_id: number
    horario_id: number
    fecha: string  // YYYY-MM-DD
    sintomas: string
    area_id?: number
    dni_acompanante?: string
    nombre_acompanante?: string
    telefono_acompanante?: string
    datos_adicionales?: Record<string, unknown>
}

// Respuesta de crear cita
export interface CrearCitaResponse {
    message: string
    data: Cita
    cupos_restantes: number
}

// Parámetros para listar citas
export interface ListarCitasParams {
    page?: number
    per_page?: number
    fecha?: string           // Fecha de la cita (YYYY-MM-DD)
    fecha_registro?: string  // Fecha de registro (YYYY-MM-DD)
    doctor_id?: number
    area?: string            // Búsqueda por nombre de área
    area_id?: number         // Filtrar por ID de área
    estado?: string          // pendiente, confirmada, atendida, cancelada, referido, no_asistio
    paciente_dni?: string    // Búsqueda parcial por DNI
    turno?: 'M' | 'T'        // Filtrar por turno
}

// Respuesta de listar citas
export interface ListarCitasResponse {
    total: number
    pages: number
    current_page: number
    per_page: number
    data: Cita[]
}

// ==================== INTERFACES PARA IMPRESIÓN ====================

// Parámetros para obtener citas confirmadas para impresión
export interface CitaConfirmadaParams {
    fecha: string       // YYYY-MM-DD
    area_id: number
    medico_id?: number | null // Nuevo campo opcional
}

// Paciente en cita confirmada
export interface PacienteConfirmada {
    id: number
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    dni: string
    telefono?: string | null
}

// Horario en cita confirmada
export interface HorarioConfirmada {
    id: number
    hora_inicio: string
    hora_fin: string
    turno: 'M' | 'T'
    turno_nombre: string
}

// Cita confirmada para impresión (con número)
export interface CitaConfirmadaItem {
    numero: number
    id: number
    paciente: PacienteConfirmada
    horario: HorarioConfirmada | null
    fecha_registro: string
}

// Respuesta del endpoint de citas confirmadas
export interface CitaConfirmadaResponse {
    success: boolean
    fecha: string
    area: {
        id: number
        nombre: string
    }
    total: number
    citas: CitaConfirmadaItem[]
}

const citaService = {
    // Crear nueva cita
    crearCita(payload: CrearCitaPayload) {
        return api.post<CrearCitaResponse>('/citas/', payload)
    },

    // Listar citas con filtros y paginación
    getCitas(params?: ListarCitasParams) {
        return api.get<ListarCitasResponse>('/citas/', { params })
    },

    // Obtener cita por ID (detalle completo)
    getCita(id: number) {
        return api.get<Cita>(`/citas/${id}`)
    },

    // Actualizar cita (estado, sintomas, etc.)
    actualizarCita(id: number, data: Partial<Cita>) {
        return api.put<Cita>(`/citas/${id}`, data)
    },

    // Eliminar cita permanentemente
    eliminarCita(id: number) {
        return api.delete<{ message: string }>(`/citas/${id}`)
    },

    // Obtener citas confirmadas para impresión (ordenadas por fecha de registro)
    getCitasConfirmadas(params: CitaConfirmadaParams) {
        return api.get<CitaConfirmadaResponse>('/citas/confirmadas', { params })
    },

    // Descargar PDF de citas confirmadas
    descargarPDFCitasConfirmadas(params: CitaConfirmadaParams) {
        return api.get('/citas/confirmadas/pdf', {
            params,
            responseType: 'blob' as const
        })
    },

    // Obtener historial de cambios de estado de una cita
    getHistorialCita(citaId: number) {
        return api.get<HistorialEstadoResponse>(`/citas/${citaId}/historial`)
    }
}

// Interface para el historial de cambios de estado
export interface HistorialEstadoItem {
    id: number
    cita_id: number
    estado_anterior: string | null
    estado_nuevo: string
    usuario_id: number | null
    usuario_nombre: string
    fecha_cambio: string
    comentario: string | null
    ip_address: string | null
}

export interface HistorialEstadoResponse {
    cita_id: number
    total: number
    historial: HistorialEstadoItem[]
}

export default citaService
