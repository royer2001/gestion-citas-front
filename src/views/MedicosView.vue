<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">
        Administración de Médicos
      </h1>
      <button @click="abrirModalCrear"
        class="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2">
        <UserPlusIcon class="w-5 h-5" />
        Nuevo Médico
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-emerald-100 rounded-lg">
          <FunnelIcon class="w-5 h-5 text-emerald-600" />
        </div>
        <h2 class="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="filtroArea" class="block text-sm font-medium text-gray-700 mb-2">
            Área/Especialidad
          </label>
          <select id="filtroArea" v-model="filtros.area"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
            <option value="">Todas las áreas</option>
            <option v-for="area in areas" :key="area.id" :value="area.nombre.toLowerCase().replace(/ /g, '_')">{{
              area.nombre }}</option>
          </select>
        </div>

        <div>
          <label for="filtroEstado" class="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select id="filtroEstado" v-model="filtros.estado"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div>
          <label for="filtroBuscar" class="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input type="text" id="filtroBuscar" v-model="filtros.busqueda" placeholder="Nombre o DNI"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>
      </div>
    </div>

    <!-- Tabla de médicos -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <ArrowPathIcon class="w-10 h-10 mx-auto text-emerald-500 animate-spin" />
        <p class="mt-4 text-gray-500">Cargando médicos...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médico
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidad
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DNI
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="medico in paginatedMedicos" :key="medico.id" class="hover:bg-gray-50 transition duration-150">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span class="text-emerald-600 font-semibold">{{
                      medico.iniciales
                    }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ medico.nombre }}
                    </div>
                    <div class="text-sm text-gray-500">{{ medico.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  {{ formatArea(medico.area) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ medico.dni }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  medico.estado === 'activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]">
                  {{ medico.estado === "activo" ? "Activo" : "Inactivo" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div v-if="procesandoMedicoId === medico.id"
                  class="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <ArrowPathIcon class="w-4 h-4 animate-spin" />
                  <span class="text-xs font-medium">Procesando...</span>
                </div>
                <div v-else class="flex gap-2">
                  <button @click="editarMedico(medico)" class="text-green-600 hover:text-green-800 transition"
                    title="Editar">
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button @click="toggleEstado(medico)" :class="[
                    'transition',
                    medico.estado === 'activo'
                      ? 'text-red-600 hover:text-red-800'
                      : 'text-green-600 hover:text-green-800',
                  ]" :title="medico.estado === 'activo' ? 'Desactivar' : 'Activar'
                    ">
                    <NoSymbolIcon v-if="medico.estado === 'activo'" class="w-5 h-5" />
                    <CheckCircleIcon v-else class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mensaje cuando no hay resultados -->
      <div v-if="!loading && medicosFiltrados.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="mt-4 text-gray-500">
          No se encontraron médicos con los filtros aplicados
        </p>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="!loading && medicosFiltrados.length > 0"
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg shadow-lg mt-[-24px] mb-8">
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
        <div class="flex items-center gap-4">
          <p class="text-sm text-gray-700">
            Mostrando
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            a
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, medicosFiltrados.length) }}</span>
            de
            <span class="font-medium">{{ medicosFiltrados.length }}</span>
            resultados
          </p>
          <select v-model="itemsPerPage"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md">
            <option :value="5">5 por página</option>
            <option :value="10">10 por página</option>
            <option :value="20">20 por página</option>
            <option :value="50">50 por página</option>
          </select>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
              <span class="sr-only">Anterior</span>
              <ChevronLeftIcon class="w-5 h-5" />
            </button>

            <button v-for="page in totalPages" :key="page" @click="currentPage = page"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
              :class="page === currentPage ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'">
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

    <!-- Modal de Crear/Editar -->
    <ModalFormMedico :visible="modalForm.visible" :es-edicion="modalForm.esEdicion" :medico-data="formData"
      :areas="areas" @close="cerrarModalForm" @save="guardarMedico" />

    <!-- Modal de Detalle -->
    <ModalDetalleMedico :visible="modalDetalle.visible" :medico="modalDetalle.medico" @close="cerrarModalDetalle"
      @editar="editarMedico" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import Swal from 'sweetalert2';
import ModalFormMedico from '../components/medicos/ModalFormMedico.vue';
import ModalDetalleMedico from '../components/medicos/ModalDetalleMedico.vue';
import { medicoService, type Medico } from '../services/medicoService';
import areaService, { type Area } from '../services/areaService';
import {
  UserPlusIcon,
  EyeIcon,
  PencilSquareIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline';

interface Filtros {
  area: string;
  estado: string;
  busqueda: string;
}

const filtros = ref<Filtros>({
  area: "",
  estado: "",
  busqueda: "",
});

const modalForm = ref({
  visible: false,
  esEdicion: false,
});

const modalDetalle = ref<{
  visible: boolean;
  medico: Medico | null;
}>({
  visible: false,
  medico: null,
});

interface FormDataLocal {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  cmp: string;
  dni: string;
  area: string;
  especialidad: string;
  horario: string;
  cuposDia: number;
  direccion: string;
  username: string;
  password?: string;
}

const formData = ref<FormDataLocal>({
  id: 0,
  nombre: "",
  email: "",
  telefono: "",
  cmp: "",
  dni: "",
  area: "",
  especialidad: "",
  horario: "",
  cuposDia: 10,
  direccion: "",
  username: "",
  password: "",
});

const medicos = ref<Medico[]>([]);
const areas = ref<Area[]>([]);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const [medicosRes, areasRes] = await Promise.all([
      medicoService.getMedicos(),
      areaService.getAreas()
    ]);
    medicos.value = medicosRes;
    areas.value = areasRes.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const medicosFiltrados = computed(() => {
  return medicos.value.filter((medico) => {
    const cumpleArea =
      !filtros.value.area || medico.area === filtros.value.area;
    const cumpleEstado =
      !filtros.value.estado || medico.estado === filtros.value.estado;
    const cumpleBusqueda =
      !filtros.value.busqueda ||
      medico.nombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      (medico.dni && medico.dni.includes(filtros.value.busqueda)) ||
      (medico.username && medico.username.includes(filtros.value.busqueda));

    return cumpleArea && cumpleEstado && cumpleBusqueda;
  });
});

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(5);
const procesandoMedicoId = ref<number | null>(null);

const paginatedMedicos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return medicosFiltrados.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(medicosFiltrados.value.length / itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Resetear página cuando cambian los filtros
watch(medicosFiltrados, () => {
  currentPage.value = 1;
});

const formatArea = (areaKey: string): string => {
  if (!areaKey) return '-';
  // normalize areaKey to lower case and match with area nombre
  const areaObj = areas.value.find(a =>
    a.nombre.toLowerCase().replace(/ /g, '_') === areaKey ||
    a.nombre.toLowerCase() === areaKey.toLowerCase()
  );
  return areaObj ? areaObj.nombre : areaKey;
};

const abrirModalCrear = () => {
  modalForm.value.visible = true;
  modalForm.value.esEdicion = false;
  formData.value = {
    id: 0,
    nombre: "",
    email: "",
    telefono: "",
    cmp: "",
    dni: "",
    area: "",
    especialidad: "",
    horario: "",
    cuposDia: 10,
    direccion: "",
    username: "",
    password: ""
  };
};

const editarMedico = (medico: Medico) => {
  modalForm.value.visible = true;
  modalForm.value.esEdicion = true;
  formData.value = {
    id: medico.id,
    nombre: medico.nombre,
    email: medico.email,
    telefono: medico.telefono,
    cmp: medico.cmp,
    dni: medico.dni,
    area: medico.area,
    especialidad: medico.especialidad,
    horario: medico.horario,
    cuposDia: medico.cuposDia,
    direccion: medico.direccion || "",
    username: medico.username,
    password: "",
  };
  if (modalDetalle.value.visible) {
    cerrarModalDetalle();
  }
};

const guardarMedico = async (data: FormDataLocal) => {
  try {
    if (modalForm.value.esEdicion) {
      await medicoService.updateMedico(data.id, {
        name: data.nombre,
        username: data.username,
        role: 'medico',
        password: data.password || undefined
      });
    } else {
      await medicoService.createMedico({
        name: data.nombre,
        username: data.username,
        password: data.password,
        role: 'medico',
        dni: data.dni || data.cmp
      });
    }

    await fetchData();

    cerrarModalForm();

    Swal.fire({
      title: modalForm.value.esEdicion ? '¡Actualizado!' : '¡Registrado!',
      text: `El médico ha sido ${modalForm.value.esEdicion ? 'actualizado' : 'registrado'} exitosamente.`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.error || 'Ocurrió un error al guardar';
    Swal.fire('Error', msg, 'error');
  }
};

const verDetalle = (medico: Medico) => {
  modalDetalle.value.medico = medico;
  modalDetalle.value.visible = true;
};

const toggleEstado = async (medico: Medico) => {
  const accion = medico.estado === "activo" ? "desactivar" : "activar";
  const nuevoEstado = medico.estado === "activo" ? "inactivo" : "activo";
  const colorBoton = medico.estado === "activo" ? "#EF4444" : "#10B981";

  const result = await Swal.fire({
    title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} médico?`,
    text: `El médico pasará a estado ${nuevoEstado}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: colorBoton,
    cancelButtonColor: '#6B7280',
    confirmButtonText: `Sí, ${accion}`,
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    procesandoMedicoId.value = medico.id;
    try {
      await medicoService.toggleEstado(medico.id, nuevoEstado === 'activo');
      medico.estado = nuevoEstado;
      Swal.fire({
        title: nuevoEstado === 'activo' ? '¡Activado!' : '¡Desactivado!',
        text: `El médico ha sido ${accion}do exitosamente.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
    } finally {
      procesandoMedicoId.value = null;
    }
  }
};

const cerrarModalForm = () => {
  modalForm.value.visible = false;
  modalForm.value.esEdicion = false;
};

const cerrarModalDetalle = () => {
  modalDetalle.value.visible = false;
  modalDetalle.value.medico = null;
};
</script>