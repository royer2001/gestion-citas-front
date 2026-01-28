<template>
    <div>
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-800">Gestión de Especialidades</h1>
                <p class="text-sm text-gray-500 mt-1">Administra las especialidades médicas para los profesionales</p>
            </div>
            <button @click="abrirModalEspecialidad"
                class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2 shadow-md">
                <PlusIcon class="w-5 h-5" />
                Nueva Especialidad
            </button>
        </div>

        <!-- Tabla de Especialidades -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative min-h-[200px]">
            <!-- Loader -->
            <div v-if="isLoading"
                class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 font-medium">
                <div class="flex flex-col items-center">
                    <ArrowPathIcon class="w-10 h-10 animate-spin text-teal-600" />
                    <p class="mt-2 text-gray-500">Cargando especialidades...</p>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200 text-gray-600">
                        <tr>
                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                Nombre
                            </th>
                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                Descripción
                            </th>
                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                Estado
                            </th>
                            <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="esp in especialidades" :key="esp.id"
                            class="hover:bg-gray-50 transition duration-150">
                            <td class="px-6 py-4">
                                <div class="text-sm font-semibold text-gray-900">{{ esp.nombre }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-500 line-clamp-1">{{ esp.descripcion || 'Sin descripción'
                                    }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1',
                                    esp.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                ]">
                                    <span v-if="esp.activo" class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    <span v-else class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    {{ esp.activo ? 'Activo' : 'Inactivo' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <div class="flex justify-center gap-1">
                                    <button @click="editarEspecialidad(esp)"
                                        class="text-blue-600 hover:text-blue-800 transition p-2 rounded-lg hover:bg-blue-50"
                                        title="Editar">
                                        <PencilIcon class="w-5 h-5" />
                                    </button>
                                    <button @click="eliminarEspecialidad(esp.id)"
                                        class="text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50"
                                        title="Eliminar">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="especialidades.length === 0 && !isLoading">
                            <td colspan="4" class="px-6 py-16 text-center text-gray-400">
                                <TagIcon class="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p class="text-lg font-medium">No hay especialidades registradas</p>
                                <p class="text-sm">Comienza agregando una nueva especialidad médica.</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal Formulario -->
        <ModalFormEspecialidad v-if="modalVisible" :visible="modalVisible" :especialidad="selectedEspecialidad"
            @close="cerrarModal" @save="onSaved" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import especialidadService, { type Especialidad } from '../../services/especialidadService'
import ModalFormEspecialidad from './ModalFormEspecialidad.vue'
import Swal from 'sweetalert2'
import {
    PlusIcon,
    ArrowPathIcon,
    PencilIcon,
    TrashIcon,
    TagIcon
} from '@heroicons/vue/24/outline'

const especialidades = ref<Especialidad[]>([])
const isLoading = ref(false)
const modalVisible = ref(false)
const selectedEspecialidad = ref<Especialidad | null>(null)

const fetchEspecialidades = async () => {
    isLoading.value = true
    try {
        especialidades.value = await especialidadService.getEspecialidades()
    } catch (error) {
        console.error('Error fetching especialidades:', error)
        Swal.fire('Error', 'No se pudieron cargar las especialidades', 'error')
    } finally {
        isLoading.value = false
    }
}

const abrirModalEspecialidad = () => {
    selectedEspecialidad.value = null
    modalVisible.value = true
}

const editarEspecialidad = (esp: Especialidad) => {
    selectedEspecialidad.value = { ...esp }
    modalVisible.value = true
}

const cerrarModal = () => {
    modalVisible.value = false
    selectedEspecialidad.value = null
}

const onSaved = () => {
    fetchEspecialidades()
    cerrarModal()
}

const eliminarEspecialidad = async (id: number) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d9488',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        try {
            await especialidadService.deleteEspecialidad(id)
            await fetchEspecialidades()
            Swal.fire('Eliminado', 'La especialidad ha sido eliminada.', 'success')
        } catch (error: any) {
            console.error('Error deleting especialidad:', error)
            const msg = error.response?.data?.error || 'No se pudo eliminar la especialidad'
            Swal.fire('Error', msg, 'error')
        }
    }
}

onMounted(fetchEspecialidades)
</script>
