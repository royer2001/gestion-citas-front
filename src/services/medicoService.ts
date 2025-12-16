
import api from './api';

export interface Medico {
    id: number;
    nombre: string;
    iniciales: string;
    email: string;
    telefono: string;
    cmp: string;
    dni: string;
    area: string;
    especialidad: string;
    horario: string;
    cuposDia: number;
    direccion?: string;
    estado: 'activo' | 'inactivo';
    username: string; // Added for edit form
}

export interface CreateMedicoPayload {
    name: string;
    username: string;
    password?: string;
    role: 'medico';
    dni?: string;
}

export const medicoService = {
    async getMedicos(areaId?: number): Promise<Medico[]> {
        const response = await api.get('/medicos/', {
            params: { area_id: areaId }
        });
        
        return response.data.map((m: any) => ({
            id: m.id,
            nombre: m.nombres_completos || m.name,
            iniciales: this.obtenerIniciales(m.nombres_completos || m.name || ''),
            email: '', // Not in DB
            telefono: '', // Not in DB
            cmp: m.dni || '', // Using DNI as CMP placeholder if needed, or just display DNI
            dni: m.dni,
            area: m.area_id ? (m.area_nombre || '').toLowerCase().replace(' ', '_') : '', 
            especialidad: m.especialidad || m.area_nombre || '',
            horario: '', // Requires complex logic/another endpoint
            cuposDia: 0,
            direccion: '',
            estado: m.activo ? 'activo' : 'inactivo',
            username: m.username
        }));
    },

    async createMedico(data: CreateMedicoPayload) {
        // Uses the user creation endpoint since doctors are users
        const response = await api.post('/auth/users', {
            ...data,
            role: 'medico'
        });
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
        const palabras = nombre.split(" ");
        return palabras
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase();
    }
};

export default medicoService;
