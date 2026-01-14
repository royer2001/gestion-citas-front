<template>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Header con estilo similar a Historial de Citas -->
        <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 class="text-xl font-bold">Directorio de Pacientes</h2>
                    <p class="text-teal-100 text-sm mt-1">Gestiona y consulta la información de los pacientes</p>
                </div>
                <!-- Botón Nuevo Paciente: solo Admin y Asistente -->
                <button v-if="canEditPatients" @click="abrirModalRegistro"
                    class="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-medium text-sm border border-white/30">
                    <UserPlusIcon class="w-5 h-5" />
                    <span>Nuevo Paciente</span>
                </button>
            </div>
        </div>

        <!-- Buscador -->
        <div class="p-4 border-b border-gray-200 bg-gray-50">
            <div class="relative w-full md:w-96">
                <input type="text" v-model="busquedaPaciente" placeholder="Buscar por DNI o Nombre..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            </div>
        </div>

        <!-- Tabla -->
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Paciente</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Teléfono/Celular</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seguro</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="isLoading">
                        <td colspan="6" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <ArrowPathIcon class="w-10 h-10 animate-spin text-teal-500 mb-3" />
                                <span class="text-gray-500 font-medium">Cargando pacientes...</span>
                            </div>
                        </td>
                    </tr>
                    <template v-else>
                        <tr v-for="paciente in pacientes" :key="paciente.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div
                                        class="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                                        <span class="text-teal-600 font-semibold text-sm">{{ paciente.nombres?.[0] || ''
                                            }}{{
                                                paciente.apellidoPaterno?.[0] || paciente.apellido_paterno?.[0] || ''
                                            }}</span>
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">{{
                                            paciente.apellidoPaterno || paciente.apellido_paterno }} {{
                                                paciente.apellidoMaterno || paciente.apellido_materno }}, {{
                                                paciente.nombres }}</div>
                                        <div class="text-xs text-gray-500">{{ paciente.email || 'Sin email' }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">{{ paciente.dni }}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">{{ paciente.edad }} años</td>
                            <td class="px-6 py-4 text-sm text-gray-500">{{ paciente.telefono || '-' }}</td>
                            <td class="px-6 py-4">
                                <span
                                    :class="['px-2 py-1 text-xs font-semibold rounded-full', paciente.seguro === 'SIS' ? 'bg-blue-100 text-blue-800' : paciente.seguro === 'ESSALUD' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800']">
                                    {{ paciente.seguro || 'Particular' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm font-medium">
                                <button @click="verHistorial(paciente)" class="text-teal-600 hover:text-teal-900 mr-3"
                                    title="Ver Historial">
                                    <ClockIcon class="w-5 h-5" />
                                </button>
                                <!-- Editar: solo Admin y Asistente -->
                                <button v-if="canEditPatients" @click="editarPaciente(paciente)"
                                    class="text-blue-600 hover:text-blue-900" title="Editar">
                                    <PencilIcon class="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                        <tr v-if="pacientes.length === 0">
                            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                                No se encontraron pacientes
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalItems > 0"
            class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                    Anterior
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                    Siguiente
                </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-700">
                        Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a <span
                            class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems)
                            }}</span> de
                        <span class="font-medium">{{ totalItems }}</span> resultados
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button @click="prevPage" :disabled="currentPage === 1"
                            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                            <span class="sr-only">Anterior</span>
                            <ChevronLeftIcon class="w-5 h-5" />
                        </button>
                        <button v-for="page in displayedPages" :key="page" @click="currentPage = page"
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                            :class="page === currentPage ? 'z-10 bg-teal-50 border-teal-500 text-teal-600' : 'text-gray-500 hover:bg-gray-50'">
                            {{ page }}
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                            <span class="sr-only">Siguiente</span>
                            <ChevronRightIcon class="w-5 h-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    </div>

    <!-- Modales desacoplados -->
    <ModalHistorialPaciente :show="showHistorialModal" :paciente="pacienteSeleccionado"
        @close="showHistorialModal = false" />

    <!-- Modal unificado para Registrar y Editar pacientes -->
    <ModalFormPaciente :show="showFormModal" :paciente="pacienteSeleccionado" @close="showFormModal = false"
        @saved="onPacienteGuardado" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import pacienteService, { type Paciente } from "../../services/pacienteService";
import ModalHistorialPaciente from "./ModalHistorialPaciente.vue";
import ModalFormPaciente from "./ModalFormPaciente.vue";
import { useAuthStore } from "../../store/auth";
import {
    MagnifyingGlassIcon,
    ArrowPathIcon,
    ClockIcon,
    PencilIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    UserPlusIcon
} from '@heroicons/vue/24/outline'

// Auth store para permisos
const auth = useAuthStore();

// El médico solo puede ver historial, no editar
// Rol 1 = Admin, Rol 2 = Médico, Rol 3 = Asistente
const canEditPatients = computed(() => {
    return auth.user?.rol_id === 1 || auth.user?.rol_id === 3;
});

// Estado principal
const busquedaPaciente = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(0);
const totalItems = ref(0);
const pacientes = ref<Paciente[]>([]);
const isLoading = ref(false);

// Estado de modales
const showHistorialModal = ref(false);
const showFormModal = ref(false);
const pacienteSeleccionado = ref<Paciente | null>(null);

// Computed para mostrar máximo 5 páginas en la paginación
const displayedPages = computed(() => {
    const pages: number[] = [];
    const maxPages = 5;
    let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
    let end = Math.min(totalPages.value, start + maxPages - 1);

    if (end - start + 1 < maxPages) {
        start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

// Función para cargar pacientes desde la API
const fetchPacientes = async () => {
    isLoading.value = true;
    try {
        const params = {
            page: currentPage.value,
            per_page: itemsPerPage.value,
            search: busquedaPaciente.value
        };

        const { data } = await pacienteService.getPacientes(params);

        pacientes.value = data.data;
        totalPages.value = data.pages;
        totalItems.value = data.total;
    } catch (error) {
        console.error("Error al cargar pacientes:", error);
    } finally {
        isLoading.value = false;
    }
};

// Acciones de los botones
const verHistorial = (paciente: Paciente) => {
    pacienteSeleccionado.value = paciente;
    showHistorialModal.value = true;
};

const editarPaciente = (paciente: Paciente) => {
    pacienteSeleccionado.value = paciente;
    showFormModal.value = true;
};

const abrirModalRegistro = () => {
    pacienteSeleccionado.value = null;
    showFormModal.value = true;
};

const onPacienteGuardado = () => {
    fetchPacientes();
};

// Observadores para recargar cuando cambie la búsqueda o página
watch(busquedaPaciente, () => {
    currentPage.value = 1; // Reset a primera página en nueva búsqueda
    fetchPacientes();
});

watch(currentPage, () => {
    fetchPacientes();
});

// Cargar al inicio
onMounted(() => {
    fetchPacientes();
});

// Funciones de paginación
const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};
</script>
