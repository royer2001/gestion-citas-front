<script setup lang="ts">
import { CalendarDaysIcon, ClockIcon } from '@heroicons/vue/24/outline';
import type { UpcomingAppointment } from '../../services/dashboardService';

defineProps<{
    citas: UpcomingAppointment[];
    isLoading: boolean;
}>();

// Helpers para fechas (Robustos a UTC string "YYYY-MM-DD")
const getMes = (fechaStr: string) => {
    if (!fechaStr) return '';
    const parts = fechaStr.split('-');
    if (parts.length !== 3) return '';

    // Asignar y castear
    const year = parts[0] as string;
    const month = parts[1] as string;
    const day = parts[2] as string;

    // Meses en JS son 0-based
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleString('es-ES', { month: 'short' }).replace('.', '');
};

const getDia = (fechaStr: string) => {
    if (!fechaStr) return '';
    const parts = fechaStr.split('-');
    if (parts.length !== 3) return '';
    return parts[2]; // Retorna el día tal cual del string "2024-12-08" -> "08"
};

const getEstadoClass = (_estado: string, color?: string) => {
    const colorMap: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        teal: 'bg-teal-100 text-teal-800',
        red: 'bg-red-100 text-red-800',
        gray: 'bg-gray-100 text-gray-800',
        purple: 'bg-purple-100 text-purple-800',
        orange: 'bg-orange-100 text-orange-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        slate: 'bg-slate-100 text-slate-800'
    }
    const baseClass = (color && colorMap[color]) ? colorMap[color] : 'bg-gray-100 text-gray-800'
    return `px-3 py-1 rounded-full text-xs font-medium ${baseClass}`
};
</script>

<template>
    <div class="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-emerald-100 rounded-lg">
                    <CalendarDaysIcon class="w-5 h-5 text-emerald-600" />
                </div>
                <h2 class="text-lg font-semibold text-gray-800">Próximas Citas</h2>
            </div>
            <router-link to="/citas" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Ver
                todas</router-link>
        </div>
        <div v-if="isLoading" class="p-6 space-y-4">
            <div v-for="i in 5" :key="i" class="flex justify-between items-center animate-pulse">
                <div class="flex gap-4 w-full">
                    <div class="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div class="w-20 h-6 bg-gray-200 rounded-full"></div>
            </div>
        </div>
        <div v-else class="divide-y divide-gray-200">
            <div v-if="citas.length === 0" class="p-8 text-center text-gray-500">
                No hay citas próximas programadas.
            </div>
            <div v-for="cita in citas" :key="cita.id" class="p-6 hover:bg-gray-50 transition duration-150">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="bg-gray-100 p-3 rounded-lg text-center min-w-[60px]">
                            <p class="text-xs text-gray-500 uppercase font-bold">{{ getMes(cita.fecha) }}</p>
                            <p class="text-xl font-bold text-gray-800">{{ getDia(cita.fecha) }}</p>
                        </div>
                        <div>
                            <h3 class="text-base font-semibold text-gray-900">{{ cita.paciente }}</h3>
                            <p class="text-sm text-gray-500">{{ cita.especialidad }} - {{ cita.doctor }}</p>
                            <p class="text-xs text-gray-400 mt-1 flex items-center">
                                <ClockIcon class="w-3 h-3 mr-1" />
                                {{ cita.hora }}
                            </p>
                        </div>
                    </div>
                    <span :class="getEstadoClass(cita.estado, cita.color_estado)">
                        {{ cita.estado }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
