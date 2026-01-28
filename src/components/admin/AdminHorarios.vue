<template>
    <div class="space-y-6">
        <!-- Header con estadísticas -->
        <div class="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold flex items-center gap-3">
                        <CalendarIcon class="w-8 h-8 text-teal-200" />
                        Gestión de Horarios de Profesionales
                    </h1>
                    <p class="text-teal-100 mt-1">Configura la disponibilidad de los profesionales de forma sencilla</p>
                </div>
                <button @click="abrirModalHorario"
                    class="bg-white text-teal-700 hover:bg-teal-50 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
                    <PlusCircleIcon class="w-6 h-6" />
                    Nuevo Horario
                </button>
            </div>

            <!-- Stats cards -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <UsersIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ todosMedicos.length }}</p>
                            <p class="text-xs text-teal-100">Profesionales</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <BuildingOfficeIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ areas.length }}</p>
                            <p class="text-xs text-teal-100">Áreas</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-amber-400/80 rounded-full flex items-center justify-center">
                            <SunIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ totalCuposManana }}</p>
                            <p class="text-xs text-teal-100">Cupos Mañana</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-indigo-400/80 rounded-full flex items-center justify-center">
                            <MoonIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ totalCuposTarde }}</p>
                            <p class="text-xs text-teal-100">Cupos Tarde</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <TicketIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ totalCupos }}</p>
                            <p class="text-xs text-teal-100">Total Cupos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros mejorados -->
        <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-emerald-100 rounded-lg">
                    <FunnelIcon class="w-5 h-5 text-emerald-600" />
                </div>
                <h2 class="text-lg font-semibold text-gray-800">Filtrar Horarios</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                        <BuildingOfficeIcon class="w-4 h-4" /> Área
                    </label>
                    <select v-model="filtroAreaId" @change="cargarHorariosFiltrados"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                        <option :value="null">Todas las áreas</option>
                        <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.nombre }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                        <UserIcon class="w-4 h-4" /> Profesional
                    </label>
                    <select v-model="filtroMedicoId" @change="cargarHorariosFiltrados"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                        <option :value="null">Todos los profesionales</option>
                        <option v-for="medico in medicos" :key="medico.id" :value="medico.id">{{ medico.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                        <CalendarIcon class="w-4 h-4" /> Mes
                    </label>
                    <input type="month" v-model="filtroMes" @change="cargarHorariosFiltrados"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                        <ClockIcon class="w-4 h-4" /> Turno
                    </label>
                    <select v-model="filtroTurno" @change="cargarHorariosFiltrados"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                        <option :value="null">Todos los turnos</option>
                        <option value="M">🌞 Mañana (07:30-13:30)</option>
                        <option value="T">🌙 Tarde (13:30-19:30)</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button @click="limpiarFiltros"
                        class="w-full px-4 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition flex items-center justify-center gap-2">
                        <XMarkIcon class="w-5 h-5" />
                        Limpiar
                    </button>
                </div>
            </div>
        </div>

        <!-- Toggle de vista -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button @click="vistaActual = 'medicos'" :class="[
                    'px-4 py-2 rounded-md transition font-medium text-sm flex items-center gap-2',
                    vistaActual === 'medicos' ? 'bg-white shadow text-teal-700' : 'text-gray-600 hover:text-gray-800'
                ]">
                    <UsersIcon class="w-5 h-5" />
                    Profesionales
                </button>
                <button v-if="filtroMedicoId && filtroMes" @click="vistaActual = 'calendario'" :class="[
                    'px-4 py-2 rounded-md transition font-medium text-sm flex items-center gap-2',
                    vistaActual === 'calendario' ? 'bg-white shadow text-teal-700' : 'text-gray-600 hover:text-gray-800'
                ]">
                    <CalendarIcon class="w-5 h-5" />
                    Calendario
                </button>
            </div>
        </div>

        <!-- Vista de Profesionales -->
        <div v-if="vistaActual === 'medicos'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-if="isLoadingList" v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-gray-200 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>

            <template v-if="!isLoadingList">
                <div v-for="medico in todosMedicos" :key="medico.id" @click="abrirModalHorariosMedico(medico)"
                    class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-teal-500 group">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-lg group-hover:bg-teal-600 group-hover:text-white transition">
                            {{ getInitials(medico.name) }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="font-semibold text-gray-900 truncate">{{ medico.name }}</h3>
                            <p class="text-sm text-gray-500">{{ medico.especialidad || 'Profesional' }}</p>
                        </div>
                        <ChevronRightIcon class="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition" />
                    </div>

                    <!-- Área/Servicio -->
                    <div v-if="medico.area_nombre || medico.area_id"
                        class="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <BuildingOfficeIcon class="w-4 h-4 text-blue-500" />
                        <span class="font-medium">{{ medico.area_nombre || getAreaNombre(medico.area_id) }}</span>
                    </div>

                    <div class="mt-3 flex flex-wrap gap-2">
                        <span v-if="getMedicoHorariosCount(medico.id) > 0"
                            class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                            {{ getMedicoHorariosCount(medico.id) }} horarios
                        </span>
                        <span v-else class="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                            Sin horarios
                        </span>
                    </div>
                </div>
            </template>
        </div>

        <!-- Vista de Calendario -->
        <div v-if="vistaActual === 'calendario' && filtroMedicoId && filtroMes"
            class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CalendarIcon class="w-6 h-6 text-teal-600" />
                    Calendario - {{ nombreMedicoSeleccionado }}
                </h2>
                <span class="text-gray-500">{{ getMesNombre(filtroMes) }}</span>
            </div>

            <div class="grid grid-cols-7 gap-2">
                <!-- Encabezados de días -->
                <div v-for="dia in diasSemana" :key="dia"
                    class="text-center font-semibold text-gray-600 py-3 bg-gray-100 rounded-lg text-sm">
                    {{ dia }}
                </div>
                <!-- Días del mes -->
                <div v-for="(dia, index) in diasDelMes" :key="index" :class="[
                    'p-2 rounded-lg border-2 min-h-[100px] transition-all',
                    dia.esDelMes ? 'bg-white' : 'bg-gray-50',
                    (dia.turnos?.M || dia.turnos?.T) ? 'border-teal-400' : (dia.esDelMes ? 'border-gray-200' : 'border-gray-100'),
                    dia.esDelMes ? 'hover:shadow-md' : ''
                ]">
                    <div v-if="dia.esDelMes">
                        <div class="font-bold text-gray-700 mb-2 text-sm">{{ dia.numero }}</div>

                        <!-- Turno Mañana -->
                        <div v-if="dia.turnos?.M"
                            class="text-xs bg-amber-500 text-white px-2 py-1 rounded mb-1 flex items-center gap-1">
                            <SunIcon class="w-3 h-3" />
                            <span>{{ dia.turnos.M.cupos }} cupos</span>
                        </div>

                        <!-- Turno Tarde -->
                        <div v-if="dia.turnos?.T"
                            class="text-xs bg-indigo-500 text-white px-2 py-1 rounded flex items-center gap-1">
                            <MoonIcon class="w-3 h-3" />
                            <span>{{ dia.turnos.T.cupos }} cupos</span>
                        </div>

                        <div v-if="!dia.turnos?.M && !dia.turnos?.T" class="text-xs text-gray-400 italic">
                            Sin horario
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Crear Horario -->
        <ModalCrearHorario :visible="modalVisible" :medicos="todosMedicos" :areas="areas" @close="modalVisible = false"
            @saved="onHorariosSaved" />

        <!-- Modal Horarios del Profesional -->
        <ModalHorariosMedico :visible="modalMedicoVisible" :medico="medicoSeleccionado" @close="cerrarModalMedico"
            @deleted="cargarHorariosFiltrados" />

        <!-- Toast mejorado -->
        <transition enter-active-class="transition ease-out duration-300 transform"
            enter-from-class="opacity-0 translate-y-4 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition ease-in duration-200 transform"
            leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 translate-y-4 scale-95">
            <div v-if="showToast" :class="[
                'fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50',
                toastType === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            ]">
                <CheckCircleIcon v-if="toastType === 'success'" class="w-8 h-8" />
                <XCircleIcon v-else class="w-8 h-8" />
                <span class="font-medium">{{ toastMessage }}</span>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import horarioService, { type Horario } from '../../services/horarioService'
import ModalCrearHorario from './ModalCrearHorario.vue'
import ModalHorariosMedico from './ModalHorariosMedico.vue'
import {
    CalendarIcon,
    PlusCircleIcon,
    UsersIcon,
    BuildingOfficeIcon,
    SunIcon,
    MoonIcon,
    TicketIcon,
    FunnelIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronRightIcon,
    UserIcon,
    ClockIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline'

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const areas = ref<any[]>([])
const medicos = ref<any[]>([])
const todosMedicos = ref<any[]>([]) // Lista completa para el modal
const horariosList = ref<Horario[]>([])
const filtroAreaId = ref<number | null>(null)
const filtroMedicoId = ref<number | null>(null)
const filtroMes = ref('')
const filtroTurno = ref<'M' | 'T' | null>(null)
const vistaActual = ref<'medicos' | 'tabla' | 'tarjetas' | 'calendario'>('medicos')

// Modal horarios de médico
const modalMedicoVisible = ref(false)
const medicoSeleccionado = ref<any>(null)

const modalVisible = ref(false)
const isLoadingList = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Computed properties para estadísticas
const totalCuposManana = computed(() => {
    return horariosList.value
        .filter(h => h.turno === 'M')
        .reduce((sum, h) => sum + h.cupos, 0)
})

const totalCuposTarde = computed(() => {
    return horariosList.value
        .filter(h => h.turno === 'T')
        .reduce((sum, h) => sum + h.cupos, 0)
})

const totalCupos = computed(() => {
    return totalCuposManana.value + totalCuposTarde.value
})

const nombreMedicoSeleccionado = computed(() => {
    const medico = todosMedicos.value.find(m => m.id === filtroMedicoId.value)
    return medico ? medico.name : ''
})

// Computed para vista calendario
const diasDelMes = computed(() => {
    if (!filtroMes.value || !filtroMedicoId.value) return []

    const parts = filtroMes.value.split('-').map(Number)
    if (parts.length < 2 || parts[0] === undefined || parts[1] === undefined) return []
    const year = parts[0]
    const month = parts[1]
    const primerDia = new Date(year, month - 1, 1)
    const ultimoDia = new Date(year, month, 0)
    const diasEnMes = ultimoDia.getDate()

    const dias: any[] = []
    const primerDiaSemana = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1

    // Días vacíos al inicio
    for (let i = 0; i < primerDiaSemana; i++) {
        dias.push({ esDelMes: false, numero: '', turnos: {} })
    }

    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = new Date(year, month - 1, dia)
        const fechaStr = `${year}-${String(month).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
        const diaSemana = fecha.getDay() === 0 ? 6 : fecha.getDay() - 1

        // Buscar horarios para este día
        const horariosDelDia = horariosList.value.filter(h => h.fecha === fechaStr)
        const turnos: { M?: Horario, T?: Horario } = {}

        horariosDelDia.forEach(h => {
            if (h.turno === 'M') turnos.M = h
            if (h.turno === 'T') turnos.T = h
        })

        dias.push({
            esDelMes: true,
            numero: dia,
            fecha: fechaStr,
            diaSemana,
            turnos
        })
    }

    return dias
})

// Funciones auxiliares
const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getMedicoHorariosCount = (medicoId: number) => {
    return horariosList.value.filter(h => h.medico_id === medicoId).length
}

const getAreaNombre = (areaId: number | undefined) => {
    if (!areaId) return 'Sin área'
    const area = areas.value.find(a => a.id === areaId)
    return area ? area.nombre : `Área ${areaId}`
}

const getMesNombre = (mes: string) => {
    if (!mes) return ''
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const [year, month] = mes.split('-').map(Number)
    return `${meses[(month || 1) - 1]} ${year}`
}



const limpiarFiltros = () => {
    filtroAreaId.value = null
    filtroMedicoId.value = null
    filtroTurno.value = null
    const hoy = new Date()
    filtroMes.value = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
    fetchMedicos(null)
    cargarHorariosFiltrados()
}

// API calls
const fetchAreas = async () => {
    try {
        const { data } = await api.get('/areas/')
        areas.value = data
    } catch (error) {
        console.error('Error al cargar áreas', error)
    }
}

const fetchMedicos = async (filterAreaId: number | null = null) => {
    try {
        const url = filterAreaId ? `/auth/medicos?area_id=${filterAreaId}` : '/auth/medicos'
        const { data } = await api.get(url)
        // El backend ya devuelve: name, area_id, area_nombre, especialidad
        medicos.value = data

        // Si no hay filtro de área, también actualizamos la lista completa para el modal
        if (!filterAreaId) {
            todosMedicos.value = data
        }
    } catch (error) {
        console.error('Error al cargar médicos', error)
    }
}

const cargarHorariosFiltrados = async () => {
    isLoadingList.value = true
    try {
        const params: any = {}
        if (filtroAreaId.value) params.area_id = filtroAreaId.value
        if (filtroMedicoId.value) params.medico_id = filtroMedicoId.value
        if (filtroMes.value) params.mes = filtroMes.value
        if (filtroTurno.value) params.turno = filtroTurno.value

        const { data } = await horarioService.getHorarios(params)
        horariosList.value = data

        // Filtrar médicos si hay área seleccionada
        if (filtroAreaId.value) {
            await fetchMedicos(filtroAreaId.value)
            if (filtroMedicoId.value) {
                const medicoExiste = medicos.value.find(m => m.id === filtroMedicoId.value)
                if (!medicoExiste) {
                    filtroMedicoId.value = null
                }
            }
        }

    } catch (error) {
        console.error('Error al cargar horarios', error)
        horariosList.value = []
    } finally {
        isLoadingList.value = false
    }
}

const abrirModalHorario = () => {
    modalVisible.value = true
}

// Funciones para modal de horarios del médico
const abrirModalHorariosMedico = (medico: any) => {
    medicoSeleccionado.value = medico
    modalMedicoVisible.value = true
}

const cerrarModalMedico = () => {
    modalMedicoVisible.value = false
    medicoSeleccionado.value = null
}

// Callback cuando se guardan horarios desde el modal
const onHorariosSaved = (result: { creados: number; actualizados: number }) => {
    mostrarToast(`${result.creados} horarios creados, ${result.actualizados} actualizados`, 'success')
    cargarHorariosFiltrados()
}



const mostrarToast = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    toastMessage.value = mensaje
    toastType.value = tipo
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

onMounted(async () => {
    const hoy = new Date()
    filtroMes.value = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`

    // Cargar áreas primero, luego médicos (para poder mapear area_nombre)
    await fetchAreas()
    await fetchMedicos()
    cargarHorariosFiltrados()
})
</script>