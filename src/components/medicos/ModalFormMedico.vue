<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div
                class="bg-white rounded-2xl max-w-3xl w-full shadow-2xl transform transition-all max-h-[95vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold">{{ esEdicion ? "Editar Profesional" : "Nuevo Profesional" }}
                            </h3>
                            <p class="text-teal-100 text-sm mt-1">
                                {{ esEdicion ? "Actualiza los datos del profesional" : "Registra un nuevo profesional en el sistema" }}
                            </p>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Contenido del modal -->
                <div class="p-6 overflow-y-auto flex-1">
                    <form @submit.prevent="guardar" class="space-y-6">
                        <!-- Sección Datos Personales -->
                        <div>
                            <h4 class="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-4 border-b pb-2">
                                Datos Personales
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="md:col-span-1">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Nombres <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="form.nombres" required
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Ej. Juan" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Apellido Paterno <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="form.apellido_paterno" required
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Ej. Pérez" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Apellido Materno <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="form.apellido_materno" required
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Ej. García" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        DNI <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="form.dni" required maxlength="8"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="12345678" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono
                                    </label>
                                    <input type="text" v-model="form.telefono"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="987654321" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input type="email" v-model="form.email"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="doctor@ejemplo.com" />
                                </div>
                                <div class="md:col-span-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Dirección
                                    </label>
                                    <input type="text" v-model="form.direccion"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Av. Las Flores 123" />
                                </div>
                            </div>
                        </div>

                        <!-- Sección Usuario y Seguridad -->
                        <div>
                            <h4 class="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-4 border-b pb-2">
                                Credenciales de Acceso
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de Usuario <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="form.username" required
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="usuario123" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        {{ esEdicion ? 'Nueva Contraseña' : 'Contraseña' }} <span v-if="!esEdicion"
                                            class="text-red-500">*</span>
                                    </label>
                                    <input type="password" v-model="form.password" :required="!esEdicion"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="********" />
                                    <p v-if="esEdicion" class="text-xs text-gray-500 mt-1">Dejar en blanco para mantener
                                        la actual</p>
                                </div>
                            </div>
                        </div>

                        <!-- Sección Especialidades -->
                        <div>
                            <h4 class="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-4 border-b pb-2">
                                Especialidades Médicas
                            </h4>
                            <div v-if="loadingEspecialidades" class="flex items-center gap-2 text-gray-500 text-sm">
                                <ArrowPathIcon class="w-4 h-4 animate-spin" /> Cargando especialidades...
                            </div>
                            <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div v-for="esp in listEspecialidades" :key="esp.id"
                                    class="flex items-center p-3 border rounded-xl hover:bg-teal-50 transition cursor-pointer"
                                    :class="{ 'border-teal-500 bg-teal-50': form.especialidades_ids.includes(esp.id) }"
                                    @click="toggleEspecialidad(esp.id)">
                                    <input type="checkbox" :value="esp.id" v-model="form.especialidades_ids"
                                        class="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                        @click.stop />
                                    <label class="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                                        {{ esp.nombre }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-3 pt-6">
                            <button type="submit" :disabled="guardando"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <ArrowPathIcon v-if="guardando" class="w-5 h-5 animate-spin" />
                                {{ esEdicion ? "Actualizar" : "Registrar" }} Profesional
                            </button>
                            <button type="button" @click="cerrar" :disabled="guardando"
                                class="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { XMarkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import catalogoService, { type Especialidad } from '../../services/catalogoService'

interface FormData {
    id: number
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    dni: string
    username: string
    password?: string
    email: string
    telefono: string
    direccion: string
    especialidades_ids: number[]
}

interface Props {
    visible: boolean
    esEdicion: boolean
    medicoData: any | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', data: FormData): void
}>()

const form = ref<FormData>({
    id: 0,
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    dni: '',
    username: '',
    password: '',
    email: '',
    telefono: '',
    direccion: '',
    especialidades_ids: []
})

const listEspecialidades = ref<Especialidad[]>([])
const loadingEspecialidades = ref(false)
const guardando = ref(false)

const fetchEspecialidades = async () => {
    loadingEspecialidades.value = true
    try {
        const { data } = await catalogoService.getEspecialidades()
        listEspecialidades.value = data
    } catch (error) {
        console.error('Error fetching especialidades:', error)
    } finally {
        loadingEspecialidades.value = false
    }
}

watch(() => props.visible, (newVal) => {
    if (newVal) {
        fetchEspecialidades()
        if (props.medicoData) {
            form.value = {
                id: props.medicoData.id,
                nombres: props.medicoData.nombres || '',
                apellido_paterno: props.medicoData.apellido_paterno || '',
                apellido_materno: props.medicoData.apellido_materno || '',
                dni: props.medicoData.dni || '',
                username: props.medicoData.username || '',
                password: '',
                email: props.medicoData.email || '',
                telefono: props.medicoData.telefono || '',
                direccion: props.medicoData.direccion || '',
                especialidades_ids: props.medicoData.especialidades ? props.medicoData.especialidades.map((e: any) => e.id) : []
            }
        } else {
            resetForm()
        }
    }
})

const resetForm = () => {
    form.value = {
        id: 0,
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        dni: '',
        username: '',
        password: '',
        email: '',
        telefono: '',
        direccion: '',
        especialidades_ids: []
    }
}

const toggleEspecialidad = (id: number) => {
    const index = form.value.especialidades_ids.indexOf(id)
    if (index === -1) {
        form.value.especialidades_ids.push(id)
    } else {
        form.value.especialidades_ids.splice(index, 1)
    }
}

const cerrar = () => {
    emit('close')
}

const guardar = async () => {
    guardando.value = true
    try {
        emit('save', { ...form.value })
    } finally {
        guardando.value = false
    }
}
</script>
