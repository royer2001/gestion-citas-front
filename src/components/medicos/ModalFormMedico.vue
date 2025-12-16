<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div
                class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold">{{ esEdicion ? "Editar Médico" : "Nuevo Médico" }}</h3>
                            <p class="text-teal-100 text-sm mt-1">{{ esEdicion ? "Actualiza los datos del médico" :
                                "Registra un nuevo médico en el sistema" }}</p>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Contenido del modal -->
                <div class="p-6 overflow-y-auto flex-1">

                    <form @submit.prevent="guardar" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo <span class="text-red-500">*</span>
                                </label>
                                <input type="text" v-model="form.nombre" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Dr. Juan Pérez" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    DNI <span class="text-red-500">*</span>
                                </label>
                                <input type="text" v-model="form.dni" required :disabled="esEdicion"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100"
                                    placeholder="12345678" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Usuario <span class="text-red-500">*</span>
                                </label>
                                <input type="text" v-model="form.username" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="usuario" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña <span v-if="!esEdicion" class="text-red-500">*</span>
                                </label>
                                <input type="password" v-model="form.password" :required="!esEdicion"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="********" />
                                <p v-if="esEdicion" class="text-xs text-gray-500 mt-1">Dejar en blanco para mantener la
                                    actual</p>
                            </div>

                            <!-- Commented out Area field as it is not directly assignable via create user 
                            <div class="md:col-span-2"> 
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Área (Especialidad principal)
                                </label>
                                <p class="text-xs text-amber-600 mb-2">
                                   * Para asignar un área, debe configurar los horarios del médico.
                                </p>
                            </div>
                            -->
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="submit"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                {{ esEdicion ? "Actualizar" : "Registrar" }} Médico
                            </button>
                            <button type="button" @click="cerrar"
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
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface FormData {
    id: number
    nombre: string
    dni: string
    username: string
    password?: string
    // Legacy fields to safe-guard typescript in parent
    email?: string
    telefono?: string
    cmp?: string
    area?: string
    especialidad?: string
    horario?: string
    cuposDia?: number
    direccion?: string
}

interface Area {
    id: number
    nombre: string
}

interface Props {
    visible: boolean
    esEdicion: boolean
    medicoData: FormData | null
    areas?: Area[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', data: FormData): void
}>()

const form = ref<FormData>({
    id: 0,
    nombre: '',
    dni: '',
    username: '',
    password: ''
})

watch(() => props.visible, (newVal) => {
    if (newVal && props.medicoData) {
        // Ensure we map from parent structure
        // If parent passed 'cmp' as value in 'dni' or vice versa, handle it here if needed.
        // Assuming parent passes correct fields.
        form.value = { ...props.medicoData }
    } else if (newVal && !props.esEdicion) {
        form.value = {
            id: 0,
            nombre: '',
            dni: '',
            username: '',
            password: ''
        }
    }
})

const cerrar = () => {
    emit('close')
}

const guardar = () => {
    emit('save', { ...form.value })
}
</script>
