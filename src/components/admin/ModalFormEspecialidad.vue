<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="$emit('close')">
            <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold">{{ especialidad ? 'Editar' : 'Nueva' }} Especialidad</h3>
                            <p class="text-teal-100 text-sm mt-0.5">Define especialidades para los profesionales</p>
                        </div>
                        <button @click="$emit('close')"
                            class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- Body -->
                <div class="p-6">
                    <form @submit.prevent="guardar" class="space-y-5">
                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-gray-700">Nombre de la Especialidad <span
                                    class="text-red-500">*</span></label>
                            <input type="text" v-model="form.nombre" required
                                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none"
                                placeholder="Ej. Cardiología" />
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-gray-700">Descripción</label>
                            <textarea v-model="form.descripcion" rows="3"
                                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none resize-none"
                                placeholder="Breve descripción de la especialidad..."></textarea>
                        </div>

                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div class="flex items-center h-5">
                                <input type="checkbox" v-model="form.activo" id="activo"
                                    class="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer" />
                            </div>
                            <label for="activo" class="text-sm font-medium text-gray-700 cursor-pointer">
                                Esta especialidad está activa
                            </label>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg hover:shadow-teal-200 disabled:shadow-none flex items-center justify-center gap-2">
                                <ArrowPathIcon v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                                {{ especialidad ? 'Guardar Cambios' : 'Crear Especialidad' }}
                            </button>
                            <button type="button" @click="$emit('close')" :disabled="isSubmitting"
                                class="px-6 py-3 border-2 border-gray-200 text-gray-500 hover:bg-gray-50 font-bold rounded-xl transition">
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
import { ref, onMounted } from 'vue'
import { XMarkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import especialidadService, { type Especialidad } from '../../services/especialidadService'
import Swal from 'sweetalert2'

const props = defineProps<{
    visible: boolean
    especialidad: Especialidad | null
}>()

const emit = defineEmits(['close', 'save'])

const form = ref({
    nombre: '',
    descripcion: '',
    activo: true
})

const isSubmitting = ref(false)

onMounted(() => {
    if (props.especialidad) {
        form.value = {
            nombre: props.especialidad.nombre,
            descripcion: props.especialidad.descripcion || '',
            activo: props.especialidad.activo
        }
    }
})

const guardar = async () => {
    isSubmitting.value = true
    try {
        if (props.especialidad) {
            await especialidadService.updateEspecialidad(props.especialidad.id, form.value)
        } else {
            await especialidadService.createEspecialidad(form.value)
        }
        Swal.fire({
            icon: 'success',
            title: props.especialidad ? 'Actualizado' : 'Creado',
            text: `La especialidad se ha ${props.especialidad ? 'actualizado' : 'creado'} correctamente`,
            timer: 2000,
            showConfirmButton: false
        })
        emit('save')
    } catch (error: any) {
        console.error('Error saving especialidad:', error)
        const msg = error.response?.data?.error || 'No se pudo guardar la especialidad'
        Swal.fire('Error', msg, 'error')
    } finally {
        isSubmitting.value = false
    }
}
</script>
