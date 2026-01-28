<template>
    <div>
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-800">Gestión de Áreas y Servicios</h1>
                <p class="text-sm text-gray-500 mt-1">Administra las áreas y servicios médicos del centro</p>
            </div>
            <button @click="abrirModalArea"
                class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2">
                <PlusIcon class="w-5 h-5" />
                Nueva Área
            </button>
        </div>

        <!-- Tabla de Áreas -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative min-h-[200px]">
            <!-- Loader -->
            <div v-if="isLoadingListAreas"
                class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 font-medium">
                <div class="flex flex-col items-center">
                    <ArrowPathIcon class="w-10 h-10 animate-spin text-teal-600" />
                    <p class="mt-2 text-gray-500">Cargando áreas...</p>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200 text-gray-600">
                        <tr>
                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                Nombre del Área
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
                        <tr v-for="area in areas" :key="area.id" class="hover:bg-gray-50 transition duration-150">
                            <td class="px-6 py-4">
                                <div class="text-sm font-semibold text-gray-900">{{ area.nombre }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-500 line-clamp-1">{{ area.descripcion || 'Sin descripción'
                                    }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1',
                                    area.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                ]">
                                    <span v-if="area.activo" class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    <span v-else class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    {{ area.activo ? 'Activo' : 'Inactivo' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <div class="flex justify-center gap-1">
                                    <button @click="editarArea(area)"
                                        class="text-blue-600 hover:text-blue-800 transition p-2 rounded-lg hover:bg-blue-50"
                                        title="Editar área">
                                        <PencilIcon class="w-5 h-5" />
                                    </button>
                                    <button @click="eliminarArea(area.id)"
                                        class="text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50"
                                        title="Eliminar área">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="areas.length === 0 && !isLoadingListAreas">
                            <td colspan="4" class="px-6 py-16 text-center text-gray-400">
                                <BuildingOfficeIcon class="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p class="text-lg font-medium">No hay áreas registradas</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal de Crear/Editar Área -->
        <ModalCrearArea :visible="modalAreaVisible" :area="selectedArea" @close="cerrarModalArea"
            @saved="onAreaSaved" />

        <!-- Toast de notificaciones -->
        <transition enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 transform translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform translate-y-2">
            <div v-if="showToast"
                class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
                <CheckCircleIcon class="w-6 h-6" />
                <span class="font-medium">{{ toastMessage }}</span>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import ModalCrearArea from './ModalCrearArea.vue'
import {
    PlusIcon,
    ArrowPathIcon,
    PencilIcon,
    TrashIcon,
    BuildingOfficeIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/outline'

interface Area {
    id: number
    nombre: string
    descripcion: string
    activo: boolean
}

const areas = ref<Area[]>([])

const modalAreaVisible = ref(false)
const selectedArea = ref<Area | null>(null)
const isLoadingListAreas = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const errorMessage = ref('')

const abrirModalArea = () => {
    modalAreaVisible.value = true
    selectedArea.value = null
}

const editarArea = (area: Area) => {
    modalAreaVisible.value = true
    selectedArea.value = { ...area }
}

const cerrarModalArea = () => {
    modalAreaVisible.value = false
    selectedArea.value = null
}

const onAreaSaved = async () => {
    const esEdicion = !!selectedArea.value
    await fetchAreas()
    mostrarToast(esEdicion ? 'Área actualizada exitosamente' : 'Área creada exitosamente')
}

const fetchAreas = async () => {
    isLoadingListAreas.value = true
    try {
        const { data } = await api.get('/areas/')
        areas.value = data
    } catch (error) {
        console.error('Error al obtener áreas:', error)
        mostrarError('Error al cargar áreas')
    } finally {
        isLoadingListAreas.value = false
    }
}

const eliminarArea = async (id: number) => {
    if (!confirm('¿Está seguro que desea eliminar esta área?')) return

    try {
        await api.delete(`/areas/${id}`)
        await fetchAreas()
        mostrarToast('Área eliminada exitosamente')
    } catch (error) {
        console.error('Error al eliminar área:', error)
        mostrarError('Error al eliminar área')
    }
}

const mostrarToast = (mensaje: string) => {
    toastMessage.value = mensaje
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

const mostrarError = (mensaje: string) => {
    errorMessage.value = mensaje
    // Optionally show error toast or alert
}

onMounted(() => {
    fetchAreas()
})
</script>
