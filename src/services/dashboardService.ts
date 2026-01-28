import api from './api';

export interface DashboardStats {
    totalPacientes: number;
    citasHoy: number;
    citasPendientesHoy: number;
    medicosActivos: number;
    citasPendientesTotal: number;
}

export interface UpcomingAppointment {
    id: number;
    fecha: string;
    hora: string;
    paciente: string;
    doctor: string;
    especialidad: string;
    estado: string;
    color_estado?: string;
}

export interface AppointmentBySpecialty {
    nombre: string;
    cantidad: number;
    porcentaje: number;
}

export default {
    getStats() {
        return api.get<DashboardStats>('/dashboard/stats');
    },
    getUpcomingAppointments() {
        return api.get<UpcomingAppointment[]>('/dashboard/upcoming-appointments');
    },
    getAppointmentsBySpecialty() {
        return api.get<AppointmentBySpecialty[]>('/dashboard/appointments-by-specialty');
    }
};
