<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">
                Manuales de Usuario
            </h1>
            <button v-if="authStore.hasRole('administrador')" @click="abrirModalCrear"
                class="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2">
                <PlusIcon class="w-5 h-5" />
                Nuevo Manual
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
            <ArrowPathIcon class="w-10 h-10 mx-auto text-emerald-500 animate-spin" />
            <p class="mt-4 text-gray-500">Cargando manuales...</p>
        </div>

        <!-- Grid de Manuales -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="manual in manuales" :key="manual.id"
                class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200 border-l-4 border-emerald-500">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-emerald-100 rounded-full">
                        <DocumentTextIcon class="w-8 h-8 text-emerald-600" />
                    </div>
                    <div v-if="authStore.hasRole('administrador')" class="flex gap-2">
                        <button @click="editarManual(manual)" class="text-gray-400 hover:text-blue-500 transition">
                            <PencilSquareIcon class="w-5 h-5" />
                        </button>
                        <button @click="eliminarManual(manual)" class="text-gray-400 hover:text-red-500 transition">
                            <TrashIcon class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <h3 class="text-xl font-bold text-gray-800 mb-2">{{ manual.nombre }}</h3>
                <p class="text-gray-600 mb-4 line-clamp-3">{{ manual.descripcion || 'Sin descripción' }}</p>

                <div class="mt-auto">
                    <a :href="manual.url_drive" target="_blank"
                        class="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium transition">
                        Ver Manual
                        <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-1" />
                    </a>
                    <div v-if="manual.rol_id" class="mt-2 text-xs text-gray-400">
                        Visible para: {{ getRolNombre(manual.rol_id) }}
                    </div>
                    <div v-else class="mt-2 text-xs text-gray-400">
                        Visible para: Todos
                    </div>
                </div>
            </div>

            <!-- Card para agregar nuevo (visualmente atractivo) si no hay nada o siempre visible? Mejor no duplicar boton -->
        </div>

        <div v-if="!loading && manuales.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
            <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
            <p class="mt-4 text-gray-500">No hay manuales disponibles en este momento.</p>
        </div>

        <!-- Modal Form -->
        <!-- Modal Form -->
        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modal.visible"
                class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                @click.self="cerrarModal">
                <div
                    class="bg-white rounded-2xl max-w-lg w-full shadow-2xl transform transition-all max-h-[95vh] overflow-hidden flex flex-col">

                    <!-- Header del modal -->
                    <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="text-xl font-bold">{{ modal.esEdicion ? 'Editar Manual' : 'Nuevo Manual' }}
                                </h3>
                                <p v-if="modal.esEdicion" class="text-teal-100 text-sm mt-1">
                                    Actualiza los datos del manual
                                </p>
                                <p v-else class="text-teal-100 text-sm mt-1">
                                    Agrega un nuevo manual al sistema
                                </p>
                            </div>
                            <button @click="cerrarModal"
                                class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                                <XMarkIcon class="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    <!-- Contenido del modal -->
                    <div class="p-6 overflow-y-auto flex-1 text-left relative">
                        <form @submit.prevent="guardar" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Manual</label>
                                <input v-model="form.nombre" type="text"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                    placeholder="Ej. Guía de Usuario 2026">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea v-model="form.descripcion" rows="3"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                    placeholder="Breve descripción del contenido..."></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">URL Google Drive (o enlace
                                    externo)</label>
                                <input v-model="form.url_drive" type="text"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                    placeholder="https://drive.google.com/...">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Visibilidad (Rol)</label>
                                <select v-model="form.rol_id"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition bg-white">
                                    <option :value="null">Todos (Público)</option>
                                    <option :value="1">Administrador</option>
                                    <option :value="2">Médico/Profesional</option>
                                    <option :value="3">Asistente</option>
                                </select>
                            </div>

                            <div class="flex gap-3 pt-4 border-t">
                                <button type="submit" :disabled="guardando"
                                    class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                    <ArrowPathIcon v-if="guardando" class="w-5 h-5 animate-spin" />
                                    {{ guardando ? 'Guardando...' : 'Guardar Manual' }}
                                </button>
                                <button type="button" @click="cerrarModal"
                                    class="px-6 py-3 border-2 border-gray-200 text-gray-500 hover:bg-gray-50 font-bold rounded-xl transition">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { manualService, type Manual } from '../services/manualService';
import Swal from 'sweetalert2';
import {
    DocumentTextIcon,
    PlusIcon,
    ArrowPathIcon,
    PencilSquareIcon,
    TrashIcon,
    ArrowTopRightOnSquareIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const manuales = ref<Manual[]>([]);
const loading = ref(false);
const guardando = ref(false);

const modal = ref({
    visible: false,
    esEdicion: false
});

const form = ref<Partial<Manual>>({
    nombre: '',
    descripcion: '',
    url_drive: '',
    rol_id: null
});

const loadManuales = async () => {
    loading.value = true;
    try {
        // Obtenemos manuales. Podríamos filtrar por rol aquí o en el backend. 
        // El backend manualService.getManuales() ya debería retornar todo si eres admin, 
        // o si queremos implementar vista específica por rol.
        // Dado que el requerimiento es simple, traemos todos y filtramos visualmente o el backend maneja.
        // El endpoint getManuales devuelve todos. 
        if (authStore.hasRole('administrador')) {
            const res = await manualService.getManuales();
            manuales.value = res.data;
        } else {
            // Si no es admin, quizás el backend debería filtrar. 
            // Por simplicidad, y como el usuario actual tiene rol_id, usaremos getManualesPorRol si queremos ser estrictos
            // o filtrar en el cliente.
            // Usemos el endpoint general y filtremos si el backend no lo hace (aunque backend debería).
            // Por ahora backend devuelve todo en get_manuales().
            // Modificaremos para usar getManuales() y filtrar en cliente por ahora si es necesario,
            // o mejor, llamamos al endpoint por rol.
            if (authStore.user) {
                // Traemos manuales públicos (null) y del rol.
                // Si el backend getManuales() devuelve todo, filtramos aquí para asegurar.
                const res = await manualService.getManuales();
                manuales.value = res.data.filter(m => m.rol_id === null || m.rol_id === authStore.user?.rol_id);
            }
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los manuales', 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadManuales();
});

const abrirModalCrear = () => {
    modal.value.esEdicion = false;
    modal.value.visible = true;
    form.value = {
        nombre: '',
        descripcion: '',
        url_drive: '',
        rol_id: null
    };
};

const editarManual = (manual: Manual) => {
    modal.value.esEdicion = true;
    modal.value.visible = true;
    form.value = { ...manual };
};

const cerrarModal = () => {
    modal.value.visible = false;
    form.value = {};
};

const guardar = async () => {
    if (!form.value.nombre || !form.value.url_drive) {
        Swal.fire('Error', 'Nombre y URL son obligatorios', 'warning');
        return;
    }

    guardando.value = true;
    try {
        if (modal.value.esEdicion && form.value.id) {
            await manualService.updateManual(form.value.id, form.value);
            Swal.fire('Actualizado', 'Manual actualizado correctamente', 'success');
        } else {
            await manualService.createManual(form.value);
            Swal.fire('Creado', 'Manual creado correctamente', 'success');
        }
        cerrarModal();
        loadManuales();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
    } finally {
        guardando.value = false;
    }
};

const eliminarManual = async (manual: Manual) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            await manualService.deleteManual(manual.id);
            Swal.fire('Eliminado', 'El manual ha sido eliminado.', 'success');
            loadManuales();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo eliminar el manual', 'error');
        }
    }
};

const getRolNombre = (rolId: number) => {
    switch (rolId) {
        case 1: return 'Administrador';
        case 2: return 'Médico/Profesional';
        case 3: return 'Asistente';
        default: return 'Desconocido';
    }
}
</script>
