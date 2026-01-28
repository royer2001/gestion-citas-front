
import api from './api';

export interface Medico {
    id: number;
    nombre: string;
    name: string; // Alias for compatibility
    nombres?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    iniciales: string;
    email: string;
    telefono: string;
    cmp?: string;
    dni: string;
    area: string;
    especialidad?: string;
    especialidades?: any[];
    horario: string;
    cuposDia: number;
    direccion?: string;
    estado: 'activo' | 'inactivo';
    username: string;
}

export interface CreateMedicoPayload {
    name?: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    username: string;
    password?: string;
    role: 'profesional';
    dni: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    especialidades_ids?: number[];
}

export const medicoService = {
    async getMedicos(params?: { area_id?: number, activo?: boolean | 'all' }): Promise<Medico[]> {
        const response = await api.get('/medicos/', {
            params: params
        });
        
        return response.data.map((m: any) => {
            const nombreCompleto = m.nombres_completos || m.name || '';
            return {
                id: m.id,
                nombre: nombreCompleto,
                name: nombreCompleto,
                nombres: m.persona?.nombres || '',
                apellido_paterno: m.persona?.apellido_paterno || '',
                apellido_materno: m.persona?.apellido_materno || '',
                iniciales: this.obtenerIniciales(nombreCompleto),
                email: m.persona?.email || '',
                telefono: m.persona?.telefono || '',
                cmp: m.dni || '',
                dni: m.dni,
                area: m.area_id ? (m.area_nombre || '').toLowerCase().replace(' ', '_') : '', 
                especialidades: m.especialidades || [],
                horario: '',
                cuposDia: 0,
                direccion: m.persona?.direccion || '',
                estado: m.activo ? 'activo' : 'inactivo',
                username: m.username
            };
        });
    },

    async createMedico(data: CreateMedicoPayload) {
        const response = await api.post('/auth/users', data);
        return response.data;
    },

    async updateMedico(id: number, data: Partial<CreateMedicoPayload> & { activo?: boolean }) {
        const response = await api.put(`/auth/users/${id}`, data);
        return response.data;
    },

    async toggleEstado(id: number, nuevoEstado: boolean) {
        return this.updateMedico(id, { activo: nuevoEstado });
    },

    obtenerIniciales(nombre: string): string {
        if (!nombre) return '??';
        const palabras = nombre.trim().split(" ");
        return palabras
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase();
    }
};

export default medicoService;
