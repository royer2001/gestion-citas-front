<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div
                class="bg-white rounded-2xl max-w-4xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                                {{ getInitials(medico?.name || '') }}
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">{{ medico?.name }}</h3>
                                <p class="text-teal-100 text-sm">{{ medico?.especialidad || 'Profesional' }}</p>
                            </div>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Filtro de mes -->
                <div class="p-4 border-b bg-gray-50 flex items-end gap-4">
                    <div class="w-48">
                        <HsMonthYearPicker label="Mes" v-model="mesSeleccionado" @change="cargarHorarios"
                            :min-date="'2020-01'" :max-date="'2030-12'" />
                    </div>
                    <button @click="cargarHorarios"
                        class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 mb-[1px]">
                        <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />
                        Actualizar
                    </button>
                </div>

                <!-- Contenido del modal -->
                <div class="flex-1 overflow-y-auto p-6">
                    <div v-if="loading" class="flex items-center justify-center py-12">
                        <ArrowPathIcon class="w-10 h-10 animate-spin text-teal-600" />
                    </div>

                    <div v-else-if="horarios.length === 0"
                        class="flex flex-col items-center justify-center py-12 text-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <CalendarDaysIcon class="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2">No hay horarios registrados</h3>
                        <p class="text-gray-500 text-sm">Este médico no tiene horarios para el mes seleccionado</p>
                    </div>

                    <div v-else>
                        <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <CalendarIcon class="w-5 h-5 text-teal-600" />
                            {{ getMesNombre(mesSeleccionado) }}
                        </h4>

                        <div class="grid grid-cols-7 gap-2">
                            <!-- Encabezados de días -->
                            <div v-for="dia in diasSemana" :key="dia"
                                class="text-center font-semibold text-gray-600 py-2 bg-gray-100 rounded-lg text-sm">
                                {{ dia }}
                            </div>

                            <!-- Días del mes -->
                            <div v-for="(dia, index) in diasDelMes" :key="index" :class="[
                                'p-2 rounded-lg border-2 min-h-[80px] transition-all',
                                dia.esDelMes ? 'bg-white' : 'bg-gray-50',
                                (dia.turnos?.M || dia.turnos?.T) ? 'border-teal-400' : (dia.esDelMes ? 'border-gray-200' : 'border-gray-100')
                            ]">
                                <div v-if="dia.esDelMes">
                                    <div class="font-bold text-gray-700 mb-2 text-sm">{{ dia.numero }}</div>

                                    <!-- Turno Mañana -->
                                    <div v-if="dia.turnos?.M"
                                        class="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-1.5 rounded-lg mb-1 flex items-center justify-between group/turno shadow-sm hover:shadow-md transition-all">
                                        <div class="flex items-center gap-1.5">
                                            <SunIcon class="w-4 h-4" />
                                            <span class="font-semibold text-sm">{{ dia.turnos.M.cupos }}</span>
                                        </div>
                                        <div class="flex items-center gap-0.5">
                                            <!-- Botón Editar Cupos -->
                                            <button @click.stop="abrirEditarCupos(dia.turnos.M)"
                                                class="w-5 h-5 flex items-center justify-center bg-white/90 hover:bg-white text-amber-600 hover:text-amber-700 rounded transition-all duration-200 hover:scale-110 shadow-sm"
                                                title="Editar cupos">
                                                <PencilIcon class="w-3 h-3" />
                                            </button>
                                            <!-- Botón Eliminar -->
                                            <button @click.stop="eliminarHorario(dia.turnos.M.id)"
                                                class="w-5 h-5 flex items-center justify-center bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded transition-all duration-200 hover:scale-110 shadow-sm"
                                                title="Eliminar">
                                                <TrashIcon class="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <!-- Botón para agregar turno mañana si no existe -->
                                    <button v-else @click="abrirCrearHorario(dia.fecha, 'M')"
                                        class="w-full mb-1 h-8 px-2 border-2 border-dashed border-amber-300 text-amber-500 rounded-lg hover:bg-amber-50 hover:border-amber-400 transition-all flex items-center justify-center gap-1 group overflow-hidden">
                                        <div
                                            class="flex items-center gap-1 group-hover:scale-110 transition-transform duration-200">
                                            <PlusIcon class="w-3.5 h-3.5" />
                                            <SunIcon class="w-3.5 h-3.5" />
                                        </div>
                                        <span
                                            class="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider">Mañana</span>
                                    </button>

                                    <!-- Turno Tarde -->
                                    <div v-if="dia.turnos?.T"
                                        class="bg-gradient-to-r from-indigo-400 to-indigo-500 text-white px-2 py-1.5 rounded-lg flex items-center justify-between group/turno shadow-sm hover:shadow-md transition-all">
                                        <div class="flex items-center gap-1.5">
                                            <MoonIcon class="w-4 h-4" />
                                            <span class="font-semibold text-sm">{{ dia.turnos.T.cupos }}</span>
                                        </div>
                                        <div class="flex items-center gap-0.5">
                                            <!-- Botón Editar Cupos -->
                                            <button @click.stop="abrirEditarCupos(dia.turnos.T)"
                                                class="w-5 h-5 flex items-center justify-center bg-white/90 hover:bg-white text-indigo-600 hover:text-indigo-700 rounded transition-all duration-200 hover:scale-110 shadow-sm"
                                                title="Editar cupos">
                                                <PencilIcon class="w-3 h-3" />
                                            </button>
                                            <!-- Botón Eliminar -->
                                            <button @click.stop="eliminarHorario(dia.turnos.T.id)"
                                                class="w-5 h-5 flex items-center justify-center bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded transition-all duration-200 hover:scale-110 shadow-sm"
                                                title="Eliminar">
                                                <TrashIcon class="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <!-- Botón para agregar turno tarde si no existe -->
                                    <button v-else @click="abrirCrearHorario(dia.fecha, 'T')"
                                        class="w-full h-8 px-2 border-2 border-dashed border-indigo-300 text-indigo-500 rounded-lg hover:bg-indigo-50 hover:border-indigo-400 transition-all flex items-center justify-center gap-1 group overflow-hidden">
                                        <div
                                            class="flex items-center gap-1 group-hover:scale-110 transition-transform duration-200">
                                            <PlusIcon class="w-3.5 h-3.5" />
                                            <MoonIcon class="w-3.5 h-3.5" />
                                        </div>
                                        <span
                                            class="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider">Tarde</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer del modal -->
                <div class="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <p class="text-sm text-gray-500">
                        {{ horarios.length }} horario{{ horarios.length !== 1 ? 's' : '' }} en este mes
                    </p>
                    <button @click="cerrar"
                        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </transition>

    <!-- Modal para editar cupos -->
    <transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="editandoCupos"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] px-4"
            @click.self="cerrarEditarCupos">
            <div class="bg-white rounded-xl max-w-sm w-full shadow-2xl p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <component :is="horarioEditando?.turno === 'M' ? SunIcon : MoonIcon"
                        :class="horarioEditando?.turno === 'M' ? 'w-5 h-5 text-amber-500' : 'w-5 h-5 text-indigo-500'" />
                    Editar Cupos - {{ horarioEditando?.turno === 'M' ? 'Mañana' : 'Tarde' }}
                </h3>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Número de Cupos</label>
                    <input type="number" v-model.number="nuevosCupos" min="1" max="100"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center text-lg font-semibold"
                        @keyup.enter="guardarCupos" />
                </div>

                <div class="flex gap-3">
                    <button @click="guardarCupos" :disabled="guardandoCupos"
                        class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
                        <ArrowPathIcon v-if="guardandoCupos" class="w-4 h-4 animate-spin" />
                        <CheckIcon v-else class="w-4 h-4" />
                        {{ guardandoCupos ? 'Guardando...' : 'Guardar' }}
                    </button>
                    <button @click="cerrarEditarCupos"
                        class="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </transition>

    <!-- Modal para crear horario -->
    <transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="creandoHorario"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] px-4"
            @click.self="cerrarCrearHorario">
            <div class="bg-white rounded-xl max-w-sm w-full shadow-2xl p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <component :is="nuevoHorario.turno === 'M' ? SunIcon : MoonIcon"
                        :class="nuevoHorario.turno === 'M' ? 'w-5 h-5 text-amber-500' : 'w-5 h-5 text-indigo-500'" />
                    Crear Horario - {{ nuevoHorario.turno === 'M' ? 'Mañana' : 'Tarde' }}
                </h3>

                <p class="text-sm text-gray-600 mb-4">
                    Fecha: <span class="font-semibold">{{ formatFechaCrear(nuevoHorario.fecha) }}</span>
                </p>

                <!-- Información del Profesional y Área -->
                <div class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center gap-3 mb-2">
                        <div
                            class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-700 text-sm">
                            {{ getInitials(medico?.name || '') }}
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800">{{ medico?.name }}</p>
                            <p class="text-sm text-teal-600">{{ getNombreArea(nuevoHorario.area_id) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Número de Cupos -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Número de Cupos</label>
                    <input type="number" v-model.number="nuevoHorario.cupos" min="1" max="100"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center text-lg font-semibold"
                        @keyup.enter="crearHorario" />
                </div>

                <div class="flex gap-3">
                    <button @click="crearHorario" :disabled="guardandoNuevoHorario || !nuevoHorario.area_id"
                        class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
                        <ArrowPathIcon v-if="guardandoNuevoHorario" class="w-4 h-4 animate-spin" />
                        <PlusIcon v-else class="w-4 h-4" />
                        {{ guardandoNuevoHorario ? 'Creando...' : 'Crear' }}
                    </button>
                    <button @click="cerrarCrearHorario"
                        class="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import horarioService, { type Horario } from '../../services/horarioService'
import api from '../../services/api'
import {
    CalendarIcon,
    SunIcon,
    MoonIcon,
    XMarkIcon,
    ArrowPathIcon,
    CalendarDaysIcon,
    PencilIcon,
    CheckIcon,
    TrashIcon,
    PlusIcon
} from '@heroicons/vue/24/outline'
import HsMonthYearPicker from '../common/HsMonthYearPicker.vue'

interface Area {
    id: number
    nombre: string
    activo: boolean
}

interface Props {
    visible: boolean
    medico: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'deleted'): void
    (e: 'updated'): void
    (e: 'created'): void
}>()

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const loading = ref(false)
const horarios = ref<Horario[]>([])
const mesSeleccionado = ref('')
const areas = ref<Area[]>([])

// Estado para editar cupos
const editandoCupos = ref(false)
const horarioEditando = ref<Horario | null>(null)
const nuevosCupos = ref(0)
const guardandoCupos = ref(false)

// Estado para crear horario
const creandoHorario = ref(false)
const guardandoNuevoHorario = ref(false)
const nuevoHorario = ref({
    fecha: '',
    turno: 'M' as 'M' | 'T',
    area_id: '' as number | '',
    cupos: 7
})

const getInitials = (name: string) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getMesNombre = (mes: string) => {
    if (!mes) return ''
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const [year, month] = mes.split('-').map(Number)
    return `${meses[(month || 1) - 1]} ${year}`
}

const formatFechaCrear = (fecha: string) => {
    if (!fecha) return ''
    const [year, month, day] = fecha.split('-')
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${day} ${meses[parseInt(month || '1') - 1]} ${year}`
}

const getNombreArea = (areaId: number | '') => {
    if (!areaId) return 'Sin área asignada'

    // Primero buscar en los horarios existentes
    const horarioConArea = horarios.value.find(h => h.area_id === areaId)
    if (horarioConArea?.area_nombre) {
        return horarioConArea.area_nombre
    }

    // Si no, buscar en la lista de áreas
    const area = areas.value.find(a => a.id === areaId)
    return area?.nombre || 'Área desconocida'
}

const diasDelMes = computed(() => {
    if (!mesSeleccionado.value || !props.medico) return []

    const parts = mesSeleccionado.value.split('-').map(Number)
    if (parts.length < 2 || parts[0] === undefined || parts[1] === undefined) return []
    const year = parts[0]
    const month = parts[1]
    const primerDia = new Date(year, month - 1, 1)
    const ultimoDia = new Date(year, month, 0)
    const diasEnMes = ultimoDia.getDate()

    const dias: any[] = []
    const primerDiaSemana = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1

    for (let i = 0; i < primerDiaSemana; i++) {
        dias.push({ esDelMes: false, numero: '', turnos: {} })
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fechaStr = `${year}-${String(month).padStart(2, '0')}-${String(dia).padStart(2, '0')}`

        const horariosDelDia = horarios.value.filter(h => h.fecha === fechaStr)
        const turnos: { M?: Horario, T?: Horario } = {}

        horariosDelDia.forEach(h => {
            if (h.turno === 'M') turnos.M = h
            if (h.turno === 'T') turnos.T = h
        })

        dias.push({
            esDelMes: true,
            numero: dia,
            fecha: fechaStr,
            turnos
        })
    }

    return dias
})

const cargarAreas = async () => {
    try {
        const { data } = await api.get<Area[]>('/areas/')
        areas.value = data.filter(a => a.activo)
    } catch (error) {
        console.error('Error cargando áreas:', error)
    }
}

const cargarHorarios = async () => {
    if (!props.medico) return

    loading.value = true
    try {
        const params: any = { medico_id: props.medico.id }
        if (mesSeleccionado.value) params.mes = mesSeleccionado.value

        const { data } = await horarioService.getHorarios(params)
        horarios.value = data
    } catch (error) {
        console.error('Error cargando horarios del médico:', error)
        horarios.value = []
    } finally {
        loading.value = false
    }
}

const abrirEditarCupos = (horario: Horario) => {
    horarioEditando.value = horario
    nuevosCupos.value = horario.cupos
    editandoCupos.value = true
}

const cerrarEditarCupos = () => {
    editandoCupos.value = false
    horarioEditando.value = null
    nuevosCupos.value = 0
}

const guardarCupos = async () => {
    if (!horarioEditando.value?.id || nuevosCupos.value < 1) return

    guardandoCupos.value = true
    try {
        await horarioService.actualizarHorario(horarioEditando.value.id, { cupos: nuevosCupos.value })

        await Swal.fire({
            title: '¡Actualizado!',
            text: 'Los cupos han sido actualizados.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        })

        await cargarHorarios()
        emit('updated')
        cerrarEditarCupos()
    } catch (error) {
        console.error('Error al actualizar cupos:', error)
        Swal.fire({
            title: 'Error',
            text: 'No se pudieron actualizar los cupos',
            icon: 'error'
        })
    } finally {
        guardandoCupos.value = false
    }
}

// Funciones para crear horario
const abrirCrearHorario = (fecha: string, turno: 'M' | 'T') => {
    // Obtener el area_id por defecto del médico (desde sus horarios existentes o del objeto medico)
    let defaultAreaId: number | '' = ''

    // Primero intentar obtener el área de los horarios existentes del médico
    const primerHorario = horarios.value[0]
    if (primerHorario && primerHorario.area_id) {
        defaultAreaId = primerHorario.area_id
    }
    // Si no hay horarios, intentar obtener del objeto medico
    else if (props.medico?.area_id) {
        defaultAreaId = props.medico.area_id
    }

    nuevoHorario.value = {
        fecha,
        turno,
        area_id: defaultAreaId,
        cupos: 7
    }
    creandoHorario.value = true
}

const cerrarCrearHorario = () => {
    creandoHorario.value = false
    nuevoHorario.value = {
        fecha: '',
        turno: 'M',
        area_id: '',
        cupos: 7
    }
}

const crearHorario = async () => {
    if (!nuevoHorario.value.area_id || !nuevoHorario.value.fecha || !props.medico) return

    guardandoNuevoHorario.value = true
    try {
        await horarioService.crearHorario({
            medico_id: props.medico.id,
            area_id: nuevoHorario.value.area_id as number,
            fecha: nuevoHorario.value.fecha,
            turno: nuevoHorario.value.turno,
            cupos: nuevoHorario.value.cupos,
            dia_semana: new Date(nuevoHorario.value.fecha).getDay(),
            hora_inicio: nuevoHorario.value.turno === 'M' ? '08:00' : '14:00',
            hora_fin: nuevoHorario.value.turno === 'M' ? '13:00' : '19:00'
        })

        await Swal.fire({
            title: '¡Creado!',
            text: 'El horario ha sido creado correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        })

        await cargarHorarios()
        emit('created')
        cerrarCrearHorario()
    } catch (error) {
        console.error('Error al crear horario:', error)
        Swal.fire({
            title: 'Error',
            text: 'No se pudo crear el horario',
            icon: 'error'
        })
    } finally {
        guardandoNuevoHorario.value = false
    }
}

const eliminarHorario = async (id: number | undefined) => {
    if (!id) return

    const result = await Swal.fire({
        title: '¿Está seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) return

    try {
        await horarioService.eliminarHorario(id)

        await Swal.fire({
            title: '¡Eliminado!',
            text: 'El horario ha sido eliminado.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        })

        await cargarHorarios()
        emit('deleted')
    } catch (error) {
        console.error('Error al eliminar horario', error)
        Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el horario',
            icon: 'error'
        })
    }
}

const cerrar = () => {
    emit('close')
}

watch(() => props.visible, async (newVal) => {
    if (newVal && props.medico) {
        const hoy = new Date()
        mesSeleccionado.value = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
        await Promise.all([cargarHorarios(), cargarAreas()])
    }
})
</script>
