/**
 * Servicio de Indicadores de Gestión de Citas Médicas.
 * Implementa los 3 indicadores para la tesis:
 * - Utilización de Capacidad
 * - Tasa de Inasistencia (No-Shows)
 * - Lead Time (Tiempo de Anticipación)
 */

import api from './api'

// ==================== INTERFACES ====================

// Parámetros para obtener indicadores
export interface IndicadorParams {
    fecha_inicio: string  // YYYY-MM-DD
    fecha_fin: string     // YYYY-MM-DD
    area_id?: number
}

// Parámetros para tendencia
export interface TendenciaParams extends IndicadorParams {
    agrupacion?: 'dia' | 'semana' | 'mes'
}

// Componentes de un indicador
interface IndicadorComponentes {
    citas_programadas?: number
    cupos_totales?: number
    no_shows?: number
    citas_confirmadas?: number
}

// Estructura de un indicador individual
export interface Indicador {
    nombre: string
    valor: number
    unidad: string
    descripcion: string
    formula: string
    componentes: IndicadorComponentes
}

// Respuesta del endpoint principal de indicadores
export interface IndicadoresResponse {
    success: boolean
    periodo: {
        fecha_inicio: string
        fecha_fin: string
        area_id?: number
    }
    indicadores: {
        utilizacion_capacidad: Indicador
        tasa_inasistencia: Indicador
        lead_time: Indicador
    }
    estadisticas_adicionales: {
        citas_atendidas: number
        citas_canceladas: number
        citas_no_asistio: number
        tasa_atencion_efectiva: number
    }
}

// Datos de tendencia por período
export interface DatosTendencia {
    periodo: string
    utilizacion_capacidad: number
    tasa_inasistencia: number
    lead_time: number
    detalles: {
        total_citas: number
        citas_no_canceladas: number
        no_shows: number
        atendidas: number
        cupos_totales: number
    }
}

// Respuesta del endpoint de tendencia
export interface TendenciaResponse {
    success: boolean
    agrupacion: string
    periodo: {
        fecha_inicio: string
        fecha_fin: string
    }
    datos: DatosTendencia[]
}

// Datos por área
export interface DatosArea {
    area_id: number
    area_nombre: string
    utilizacion_capacidad: number
    tasa_inasistencia: number
    lead_time: number
    detalles: {
        total_citas: number
        citas_no_canceladas: number
        no_shows: number
        atendidas: number
        cupos_totales: number
    }
}

// Respuesta del endpoint por área
export interface PorAreaResponse {
    success: boolean
    periodo: {
        fecha_inicio: string
        fecha_fin: string
    }
    areas: DatosArea[]
}

// ==================== SERVICIO ====================

const indicadorService = {
    /**
     * Obtiene los 3 indicadores principales para un período.
     * @param params Parámetros de consulta (fecha_inicio, fecha_fin, area_id opcional)
     */
    getIndicadores(params: IndicadorParams) {
        return api.get<IndicadoresResponse>('/indicadores/', { params })
    },

    /**
     * Obtiene los indicadores agrupados por período (día, semana, mes).
     * Útil para generar gráficos de tendencia.
     * @param params Parámetros incluyendo agrupación
     */
    getTendencia(params: TendenciaParams) {
        return api.get<TendenciaResponse>('/indicadores/tendencia', { params })
    },

    /**
     * Obtiene los indicadores comparativos por área/especialidad.
     * @param params Parámetros de consulta (fecha_inicio, fecha_fin)
     */
    getPorArea(params: IndicadorParams) {
        return api.get<PorAreaResponse>('/indicadores/por-area', { params })
    }
}

export default indicadorService
