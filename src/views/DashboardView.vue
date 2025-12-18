<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Welcome Section -->
        <div class="mb-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                        {{ getSaludo }}, <span
                            class="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">{{
                                getNombreUsuario }}</span> 👋
                    </h1>
                    <p class="text-gray-500 mt-1">
                        {{ getFechaCompleta }}
                    </p>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <span
                        class="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full font-medium">
                        <span class="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                        Sistema activo
                    </span>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <template v-if="isLoading">
                <div v-for="i in 4" :key="i"
                    class="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-200 animate-pulse">
                    <div class="flex items-center justify-between">
                        <div class="w-full">
                            <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div class="h-8 bg-gray-200 rounded w-1/3"></div>
                        </div>
                        <div class="bg-gray-100 p-3 rounded-full w-12 h-12"></div>
                    </div>
                    <div class="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </template>
            <template v-else>
                <!-- Total Pacientes -->
                <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-medium uppercase">Total Pacientes</p>
                            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalPacientes }}</p>
                        </div>
                        <div class="bg-blue-100 p-3 rounded-full">
                            <UsersIcon class="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p class="text-sm text-green-600 mt-4 flex items-center">
                        <ArrowTrendingUpIcon class="w-4 h-4 mr-1" />
                        <span>Registros activos</span>
                    </p>
                </div>

                <!-- Citas Hoy -->
                <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-medium uppercase">Citas Hoy</p>
                            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.citasHoy }}</p>
                        </div>
                        <div class="bg-emerald-100 p-3 rounded-full">
                            <CalendarIcon class="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <p class="text-sm text-gray-500 mt-4">
                        {{ stats.citasPendientesHoy }} pendientes de atención
                    </p>
                </div>

                <!-- Médicos Activos -->
                <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-medium uppercase">Médicos Activos</p>
                            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.medicosActivos }}</p>
                        </div>
                        <div class="bg-purple-100 p-3 rounded-full">
                            <UserPlusIcon class="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p class="text-sm text-gray-500 mt-4">
                        Personal disponible
                    </p>
                </div>

                <!-- Citas Pendientes Total -->
                <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 font-medium uppercase">Citas Pendientes</p>
                            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.citasPendientesTotal }}</p>
                        </div>
                        <div class="bg-orange-100 p-3 rounded-full">
                            <ClockIcon class="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <p class="text-sm text-orange-600 mt-4 flex items-center">
                        <ExclamationCircleIcon class="w-4 h-4 mr-1" />
                        <span>Total general</span>
                    </p>
                </div>
            </template>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Próximas Citas -->
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
                    <div v-if="proximasCitas.length === 0" class="p-8 text-center text-gray-500">
                        No hay citas próximas programadas.
                    </div>
                    <div v-for="cita in proximasCitas" :key="cita.id"
                        class="p-6 hover:bg-gray-50 transition duration-150">
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
                            <span :class="getEstadoClass(cita.estado)">
                                {{ cita.estado }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Acciones Rápidas y Estado del Sistema -->
            <div class="space-y-8">
                <!-- Acciones Rápidas -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-emerald-100 rounded-lg">
                            <BoltIcon class="w-5 h-5 text-emerald-600" />
                        </div>
                        <h2 class="text-lg font-semibold text-gray-800">Acciones Rápidas</h2>
                    </div>
                    <div class="grid grid-cols-1 gap-3">
                        <router-link to="/pacientes"
                            class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition group">
                            <div class="bg-blue-100 p-2 rounded-full mr-3 group-hover:bg-blue-200 transition">
                                <UserPlusIcon class="w-5 h-5 text-blue-600" />
                            </div>
                            <span class="font-medium text-gray-700 group-hover:text-blue-700">Registrar citas</span>
                        </router-link>

                        <router-link to="/citas"
                            class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition group">
                            <div class="bg-emerald-100 p-2 rounded-full mr-3 group-hover:bg-emerald-200 transition">
                                <CalendarDaysIcon class="w-5 h-5 text-emerald-600" />
                            </div>
                            <span class="font-medium text-gray-700 group-hover:text-emerald-700">Gestionar citas</span>
                        </router-link>

                        <!-- Solo visible para Administrador -->
                        <router-link v-if="canSeeMedicos" to="/medicos"
                            class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition group">
                            <div class="bg-purple-100 p-2 rounded-full mr-3 group-hover:bg-purple-200 transition">
                                <IdentificationIcon class="w-5 h-5 text-purple-600" />
                            </div>
                            <span class="font-medium text-gray-700 group-hover:text-purple-700">Gestionar
                                Profesionales</span>
                        </router-link>
                    </div>
                </div>

                <!-- Distribución por Especialidad -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-emerald-100 rounded-lg">
                            <ChartPieIcon class="w-5 h-5 text-emerald-600" />
                        </div>
                        <h2 class="text-lg font-semibold text-gray-800">Citas por Especialidad (Hoy)</h2>
                    </div>

                    <div v-if="isLoading" class="space-y-4 animate-pulse">
                        <div v-for="i in 3" :key="i">
                            <div class="flex justify-between mb-1">
                                <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                                <div class="h-3 bg-gray-200 rounded w-10"></div>
                            </div>
                            <div class="h-2 bg-gray-200 rounded-full w-full"></div>
                        </div>
                    </div>

                    <div v-else class="space-y-4">
                        <div v-if="citasPorEspecialidad.length === 0" class="text-sm text-gray-500 italic">
                            No hay datos para mostrar hoy.
                        </div>
                        <div v-for="item in citasPorEspecialidad" :key="item.nombre">
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600">{{ item.nombre }}</span>
                                <span class="font-medium text-gray-800">{{ item.cantidad }}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    :style="{ width: item.porcentaje + '%' }">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import dashboardService, { type DashboardStats, type UpcomingAppointment, type AppointmentBySpecialty } from '../services/dashboardService';
import {
    UsersIcon,
    ArrowTrendingUpIcon,
    CalendarIcon,
    UserPlusIcon,
    ClockIcon,
    ExclamationCircleIcon,
    IdentificationIcon,
    CalendarDaysIcon,
    BoltIcon,
    ChartPieIcon
} from '@heroicons/vue/24/outline';

const auth = useAuthStore();
const isLoading = ref(true);

// Permisos de navegación por rol
// Rol 1 = Administrador, Rol 2 = Profesional, Rol 3 = Asistente
const canSeeMedicos = computed(() => {
    // Solo Administrador puede ver la sección de Profesionales
    return auth.user?.rol_id === 1;
});

// Computed properties para el saludo personalizado
const getSaludo = computed(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Buenos días';
    if (hora >= 12 && hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
});

const getNombreUsuario = computed(() => {
    if (auth.user?.nombres_completos) {
        // Obtener solo el primer nombre
        const nombres = auth.user.nombres_completos.split(' ');
        return nombres[0];
    }
    return auth.user?.username || 'Usuario';
});

const getFechaCompleta = computed(() => {
    const fecha = new Date();
    const opciones: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const fechaFormateada = fecha.toLocaleDateString('es-PE', opciones);
    // Capitalizar primera letra
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
});

const stats = ref<DashboardStats>({
    totalPacientes: 0,
    citasHoy: 0,
    citasPendientesHoy: 0,
    medicosActivos: 0,
    citasPendientesTotal: 0
});

const proximasCitas = ref<UpcomingAppointment[]>([]);
const citasPorEspecialidad = ref<AppointmentBySpecialty[]>([]);

const fetchData = async () => {
    isLoading.value = true;
    try {
        const [statsRes, upcomingRes, specialtyRes] = await Promise.all([
            dashboardService.getStats(),
            dashboardService.getUpcomingAppointments(),
            dashboardService.getAppointmentsBySpecialty()
        ]);

        stats.value = statsRes.data;
        proximasCitas.value = upcomingRes.data;
        citasPorEspecialidad.value = specialtyRes.data;
    } catch (error) {
        console.error("Error cargando dashboard:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchData();
});

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

const getEstadoClass = (estado: string) => {
    const classes: Record<string, string> = {
        'Pendiente': 'px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
        'Confirmada': 'px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
        'Atendida': 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800',
        'Cancelada': 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800',
        'Referido': 'px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800'
    };
    return classes[estado] || 'px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
};
</script>