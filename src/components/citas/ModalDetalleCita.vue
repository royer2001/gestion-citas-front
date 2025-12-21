<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div
                class="bg-white rounded-2xl max-w-3xl w-full shadow-2xl transform transition-all max-h-[90vh] flex flex-col overflow-hidden">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white flex-shrink-0">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold">Detalle de la Cita</h3>
                            <p class="text-teal-100 text-sm mt-1">Información completa de la cita médica</p>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <div class="p-6 overflow-y-auto flex-1">

                    <!-- Skeleton Loading -->
                    <div v-if="loading" class="space-y-6 animate-pulse">
                        <!-- Skeleton: Información de la Cita -->
                        <div class="bg-gray-100 rounded-lg p-4">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-5 h-5 bg-gray-300 rounded"></div>
                                <div class="h-5 bg-gray-300 rounded w-40"></div>
                            </div>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <div class="h-3 bg-gray-300 rounded w-20 mb-2"></div>
                                    <div class="h-5 bg-gray-300 rounded w-32"></div>
                                </div>
                                <div>
                                    <div class="h-3 bg-gray-300 rounded w-16 mb-2"></div>
                                    <div class="h-5 bg-gray-300 rounded w-24"></div>
                                </div>
                                <div>
                                    <div class="h-3 bg-gray-300 rounded w-16 mb-2"></div>
                                    <div class="h-5 bg-gray-300 rounded w-28"></div>
                                </div>
                                <div>
                                    <div class="h-3 bg-gray-300 rounded w-16 mb-2"></div>
                                    <div class="h-5 bg-gray-300 rounded w-20"></div>
                                </div>
                                <div>
                                    <div class="h-3 bg-gray-300 rounded w-12 mb-2"></div>
                                    <div class="h-5 bg-gray-300 rounded w-28"></div>
                                </div>
                                <div>
                                    <div class="h-3 bg-gray-300 rounded w-16 mb-2"></div>
                                    <div class="h-5 bg-gray-300 rounded w-36"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Skeleton: Datos del Paciente -->
                        <div class="bg-gray-100 rounded-lg p-4">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-5 h-5 bg-gray-300 rounded"></div>
                                <div class="h-5 bg-gray-300 rounded w-36"></div>
                            </div>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div class="col-span-2">
                                    <div class="h-3 bg-gray-300 rounded w-28 mb-2"></div>
                                    <div class="h-5 bg-gray-300 rounded w-48"></div>
                                </div>
                                <div>
                                    <div class="h-3 bg-gray-300 rounded w-12 mb-2"></div>
                                    <div class="h-5 bg-gray-300 rounded w-24"></div>
                                </div>
                                <div>
                                    <div class="h-3 bg-gray-300 rounded w-16 mb-2"></div>
                                    <div class="h-5 bg-gray-300 rounded w-28"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Skeleton: Síntomas -->
                        <div>
                            <div class="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                            <div class="h-20 bg-gray-200 rounded-lg"></div>
                        </div>

                        <!-- Skeleton: Botones -->
                        <div class="flex gap-3 pt-4 border-t">
                            <div class="flex-1 h-10 bg-gray-300 rounded-lg"></div>
                            <div class="flex-1 h-10 bg-gray-300 rounded-lg"></div>
                        </div>
                    </div>

                    <div v-else-if="cita" class="space-y-6">
                        <!-- Información de la Cita -->
                        <div
                            class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
                            <h4 class="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                                <CalendarIcon class="w-5 h-5" />
                                Información de la Cita
                            </h4>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p class="text-xs text-gray-500">Fecha de Cita</p>
                                    <p class="font-semibold text-gray-800">
                                        {{ cita.fecha ? formatFecha(cita.fecha) : 'Sin programar' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">Turno</p>
                                    <p class="font-semibold text-gray-800">
                                        <span v-if="cita.horario_turno" :class="[
                                            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                            cita.horario_turno === 'M'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-indigo-100 text-indigo-800'
                                        ]">
                                            <SunIcon v-if="cita.horario_turno === 'M'" class="w-3 h-3 mr-1" />
                                            <MoonIcon v-else class="w-3 h-3 mr-1" />
                                            {{ cita.horario_turno_nombre }}
                                        </span>
                                        <span v-else class="text-gray-400">N/A</span>
                                    </p>
                                </div>
                                <div v-if="cita.horario">
                                    <p class="text-xs text-gray-500">Horario</p>
                                    <p class="font-semibold text-gray-800">
                                        {{ cita.horario.hora_inicio?.slice(0, 5) }} -
                                        {{ cita.horario.hora_fin?.slice(0, 5) }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">Estado</p>
                                    <span :class="getEstadoClass(cita.estado)">
                                        {{ formatEstado(cita.estado) }}
                                    </span>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">Área</p>
                                    <p class="font-semibold text-gray-800">
                                        {{ cita.area_nombre || cita.area || 'N/A' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">Profesional</p>
                                    <p class="font-semibold text-gray-800">{{ cita.doctor_nombre || 'Sin asignar' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Información del Paciente -->
                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h4 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                <UserIcon class="w-5 h-5" />
                                Datos del Paciente
                            </h4>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div class="col-span-2">
                                    <p class="text-xs text-gray-500">Nombre Completo</p>
                                    <p class="font-semibold text-gray-800">{{ getNombreCompleto(cita.paciente) }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">DNI</p>
                                    <p class="font-semibold text-gray-800">{{ cita.paciente?.dni || 'N/A' }}</p>
                                </div>
                                <div v-if="cita.paciente?.telefono">
                                    <p class="text-xs text-gray-500">Teléfono</p>
                                    <p class="font-semibold text-gray-800">{{ cita.paciente.telefono }}</p>
                                </div>
                                <div v-if="cita.paciente?.email">
                                    <p class="text-xs text-gray-500">Email</p>
                                    <p class="font-semibold text-gray-800">{{ cita.paciente.email }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Acompañante (si existe) -->
                        <div v-if="cita.nombre_acompanante"
                            class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <h4 class="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                <UsersIcon class="w-5 h-5" />
                                Acompañante
                            </h4>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p class="text-xs text-gray-500">Nombre</p>
                                    <p class="font-semibold text-gray-800">{{ cita.nombre_acompanante }}</p>
                                </div>
                                <div v-if="cita.dni_acompanante">
                                    <p class="text-xs text-gray-500">DNI</p>
                                    <p class="font-semibold text-gray-800">{{ cita.dni_acompanante }}</p>
                                </div>
                                <div v-if="cita.telefono_acompanante">
                                    <p class="text-xs text-gray-500">Teléfono</p>
                                    <p class="font-semibold text-gray-800">{{ cita.telefono_acompanante }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Síntomas -->
                        <div>
                            <p class="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                <HeartIcon class="w-5 h-5" />
                                Síntomas / Motivo de Consulta
                            </p>
                            <p class="text-gray-800 bg-gray-50 p-3 rounded-lg">{{ cita.sintomas || 'No especificado' }}
                            </p>
                        </div>

                        <!-- Fecha de registro -->
                        <div class="text-xs text-gray-400 border-t pt-3 flex items-center">
                            <ClockIcon class="w-4 h-4 mr-1" />
                            Registrado el: {{ formatFechaHora(cita.fecha_registro).fecha }} a las
                            {{ formatFechaHora(cita.fecha_registro).hora }}
                        </div>

                        <!-- Botones de acción -->
                        <div class="flex flex-wrap gap-3 pt-4 border-t">
                            <!-- Confirmar: solo Admin y Asistente -->
                            <button v-if="props.canUseManagementActions && cita.estado === 'pendiente'"
                                @click="$emit('confirmar', cita.id)"
                                class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <CheckIcon class="w-5 h-5" />
                                Confirmar Cita
                            </button>
                            <!-- Marcar Atendida: solo Admin y Médico -->
                            <button
                                v-if="props.canUseMedicalActions && !['atendida', 'cancelada', 'referido', 'no_asistio'].includes(cita.estado)"
                                @click="$emit('cambiarEstado', cita.id, 'atendida')"
                                class="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <CheckCircleIcon class="w-5 h-5" />
                                Marcar Atendida
                            </button>
                            <!-- Referir: solo Admin y Médico -->
                            <button
                                v-if="props.canUseMedicalActions && !['atendida', 'cancelada', 'referido', 'no_asistio'].includes(cita.estado)"
                                @click="$emit('cambiarEstado', cita.id, 'referido')"
                                class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <PaperAirplaneIcon class="w-5 h-5" />
                                Referir
                            </button>
                            <!-- No Asistió: solo Admin y Médico -->
                            <button
                                v-if="props.canUseMedicalActions && !['atendida', 'cancelada', 'referido', 'no_asistio'].includes(cita.estado)"
                                @click="$emit('cambiarEstado', cita.id, 'no_asistio')"
                                class="flex-1 bg-slate-500 hover:bg-slate-600 text-white py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <XCircleIcon class="w-5 h-5" />
                                No Asistió
                            </button>
                            <!-- Cancelar: solo Admin y Asistente -->
                            <button
                                v-if="props.canUseManagementActions && !['atendida', 'cancelada', 'referido', 'no_asistio'].includes(cita.estado)"
                                @click="$emit('cambiarEstado', cita.id, 'cancelada')"
                                class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <XMarkIcon class="w-5 h-5" />
                                Cancelar Cita
                            </button>
                            <button @click="cerrar"
                                class="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import {
    XMarkIcon,
    SunIcon,
    MoonIcon,
    CheckIcon,
    CheckCircleIcon,
    PaperAirplaneIcon,
    CalendarIcon,
    UserIcon,
    UsersIcon,
    HeartIcon,
    ClockIcon,
    XCircleIcon
} from '@heroicons/vue/24/outline'

interface Paciente {
    id: number
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    dni: string
    telefono?: string | null
    email?: string | null
}

interface Horario {
    id: number
    turno: 'M' | 'T'
    turno_nombre: string
    hora_inicio: string
    hora_fin: string
}

interface Cita {
    id: number
    paciente_id: number
    horario_id: number | null
    doctor_id: number | null
    area_id: number | null
    area: string | null
    area_nombre: string | null
    fecha: string | null
    fecha_registro: string
    sintomas: string
    estado: string
    doctor_nombre: string | null
    horario_turno: 'M' | 'T' | null
    horario_turno_nombre: string | null
    dni_acompanante: string | null
    nombre_acompanante: string | null
    telefono_acompanante: string | null
    paciente?: Paciente
    horario?: Horario
}

interface Props {
    visible: boolean
    loading: boolean
    cita: Cita | null
    canUseMedicalActions: boolean
    canUseManagementActions: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirmar', id: number): void
    (e: 'cambiarEstado', id: number, estado: string): void
}>()

const cerrar = () => {
    emit('close')
}

const formatFecha = (fechaStr: string): string => {
    if (!fechaStr) return ''
    const fecha = new Date(fechaStr + 'T00:00:00')
    return fecha.toLocaleDateString('es-PE', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const formatFechaHora = (fechaRegistro: string) => {
    if (!fechaRegistro) return { fecha: '', hora: '' }
    const date = new Date(fechaRegistro)
    return {
        fecha: date.toLocaleDateString('es-PE'),
        hora: date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    }
}

const formatEstado = (estado: string): string => {
    const estados: Record<string, string> = {
        pendiente: 'Pendiente',
        confirmada: 'Confirmada',
        atendida: 'Atendida',
        cancelada: 'Cancelada',
        referido: 'Referido',
        no_asistio: 'No Asistió'
    }
    return estados[estado] || estado
}

const getEstadoClass = (estado: string): string => {
    const classes: Record<string, string> = {
        pendiente: 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
        confirmada: 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
        atendida: 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
        cancelada: 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
        referido: 'px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800',
        no_asistio: 'px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800'
    }
    return classes[estado] || 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
}

const getNombreCompleto = (p: Paciente | undefined) => {
    if (!p) return 'Desconocido'
    return `${p.nombres} ${p.apellido_paterno} ${p.apellido_materno}`
}
</script>
