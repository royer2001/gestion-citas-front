<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Tabs Navigation -->
    <div class="mb-8 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <!-- Tab Usuarios: solo visible para Admin -->
        <button v-if="canSeeUsuarios" @click="activeTab = 'usuarios'" :class="[
          activeTab === 'usuarios'
            ? 'border-teal-500 text-teal-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
        ]">
          <UsersIcon class="w-5 h-5" />
          Usuarios
        </button>
        <!-- Tab Áreas: solo visible para Admin -->
        <button v-if="canSeeAreas" @click="activeTab = 'areas'" :class="[
          activeTab === 'areas'
            ? 'border-teal-500 text-teal-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
        ]">
          <BuildingOfficeIcon class="w-5 h-5" />
          Áreas / Servicios
        </button>
        <!-- Tab Horarios: visible para todos -->
        <button @click="activeTab = 'horarios'" :class="[
          activeTab === 'horarios'
            ? 'border-teal-500 text-teal-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
        ]">
          <CalendarIcon class="w-5 h-5" />
          Horarios
        </button>
        <!-- Tab Especialidades: solo visible para Admin -->
        <button v-if="canSeeEspecialidades" @click="activeTab = 'especialidades'" :class="[
          activeTab === 'especialidades'
            ? 'border-teal-500 text-teal-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
        ]">
          <TagIcon class="w-5 h-5" />
          Especialidades
        </button>
      </nav>
    </div>

    <!-- Tab Usuarios -->
    <div v-if="canSeeUsuarios" v-show="activeTab === 'usuarios'">
      <AdminUsuarios />
    </div>

    <!-- Tab Áreas / Servicios -->
    <div v-if="canSeeAreas" v-show="activeTab === 'areas'">
      <AdminAreas />
    </div>

    <!-- Tab Horarios -->
    <div v-show="activeTab === 'horarios'">
      <AdminHorarios />
    </div>

    <!-- Tab Especialidades -->
    <div v-if="canSeeEspecialidades" v-show="activeTab === 'especialidades'">
      <AdminEspecialidades />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import AdminUsuarios from '../components/admin/AdminUsuarios.vue'
import AdminAreas from '../components/admin/AdminAreas.vue'
import AdminHorarios from '../components/admin/AdminHorarios.vue'
import AdminEspecialidades from '../components/admin/AdminEspecialidades.vue'
import { UsersIcon, BuildingOfficeIcon, CalendarIcon, TagIcon } from '@heroicons/vue/24/outline'

const auth = useAuthStore()

// Permisos por rol
// Rol 1 = Administrador, Rol 2 = Médico, Rol 3 = Asistente
const canSeeUsuarios = computed(() => {
  // Solo Administrador puede ver Usuarios
  return auth.user?.rol_id === 1
})

const canSeeAreas = computed(() => {
  // Solo Administrador puede ver Áreas
  return auth.user?.rol_id === 1
})

const canSeeEspecialidades = computed(() => {
  // Solo Administrador puede ver Especialidades
  return auth.user?.rol_id === 1
})

// Determinar el tab activo inicial según el rol
const getDefaultTab = () => {
  if (auth.user?.rol_id === 3) {
    // Asistente: solo puede ver Horarios
    return 'horarios'
  }
  return 'usuarios'
}

const activeTab = ref(getDefaultTab())

// Actualizar el tab activo cuando cambie el usuario
onMounted(() => {
  activeTab.value = getDefaultTab()
})
</script>