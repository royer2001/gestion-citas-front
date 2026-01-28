<template>
  <div class="max-w-7xl mx-auto px-4 py-8">

    <!-- Tabs: estilo border-bottom -->
    <div v-if="canRegisterPatients" class="flex items-center gap-6 border-b border-gray-200 mb-8">
      <button @click="activeTab = 'registro'"
        class="flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative"
        :class="activeTab === 'registro' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'">
        <UserPlusIcon class="w-5 h-5" />
        Nuevo Registro
      </button>

      <button @click="activeTab = 'lista'"
        class="flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative"
        :class="activeTab === 'lista' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'">
        <QueueListIcon class="w-5 h-5" />
        Listado de Pacientes
      </button>
    </div>

    <!-- Contenido con Transición -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2" mode="out-in">
      <!-- Registro: solo visible si puede registrar pacientes -->
      <div v-if="activeTab === 'registro' && canRegisterPatients" key="registro">
        <PacienteRegistro />
      </div>

      <!-- Listado: siempre visible -->
      <div v-else key="lista">
        <PacienteLista />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { UserPlusIcon, QueueListIcon } from "@heroicons/vue/24/outline";
import PacienteRegistro from "../components/pacientes/PacienteRegistro.vue";
import PacienteLista from "../components/pacientes/PacienteLista.vue";
import { useAuthStore } from "../store/auth";

const auth = useAuthStore();

// El médico no puede registrar pacientes, solo ver la lista
// Rol 1 = Admin, Rol 2 = Médico, Rol 3 = Asistente
const canRegisterPatients = computed(() => {
  return auth.user?.rol_id === 1 || auth.user?.rol_id === 3;
});

// Si el usuario no puede registrar, mostrar directamente el listado
const activeTab = ref('registro');

onMounted(() => {
  if (!canRegisterPatients.value) {
    activeTab.value = 'lista';
  }
});
</script>
