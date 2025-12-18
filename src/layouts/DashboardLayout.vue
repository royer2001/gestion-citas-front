<template>
  <div class="h-screen bg-gray-100 flex overflow-hidden">
    <!-- Mobile Backdrop -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
      @click="mobileMenuOpen = false"></div>

    <!-- Sidebar -->
    <aside :class="[
      'bg-teal-700 text-white transition-all duration-300 flex flex-col',
      'fixed inset-y-0 left-0 z-30 md:relative',
      sidebarOpen ? 'md:w-64' : 'md:w-20',
      'w-64',
      mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]">
      <!-- Header del Sidebar -->
      <div class="p-4 border-b border-teal-600">
        <div class="flex items-center justify-between">
          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <h1 :class="{ 'md:hidden': !sidebarOpen }" class="font-bold text-lg whitespace-nowrap">
              C.S. LA UNIÓN
            </h1>
          </transition>
          <!-- Desktop Toggle Button -->
          <button @click="toggleSidebar" class="hidden md:block p-2 rounded-lg hover:bg-teal-600 transition-colors">
            <ChevronDoubleLeftIcon v-if="sidebarOpen" class="w-6 h-6" />
            <ChevronDoubleRightIcon v-else class="w-6 h-6" />
          </button>
          <!-- Mobile Close Button -->
          <button @click="mobileMenuOpen = false" class="md:hidden p-2 rounded-lg hover:bg-teal-600 transition-colors">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <router-link to="/dashboard"
          class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
          :class="isActive('/dashboard') ?
            'bg-white text-teal-700 shadow-lg translate-x-2' :
            'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
          <Squares2X2Icon class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
            :class="{ 'scale-110': isActive('/dashboard') }" />
          <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Dashboard</span>
        </router-link>

        <router-link to="/pacientes"
          class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
          :class="isActive('/pacientes') ?
            'bg-white text-teal-700 shadow-lg translate-x-2' :
            'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
          <UserGroupIcon class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
            :class="{ 'scale-110': isActive('/pacientes') }" />
          <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Pacientes</span>
        </router-link>

        <router-link to="/citas"
          class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
          :class="isActive('/citas') ?
            'bg-white text-teal-700 shadow-lg translate-x-2' :
            'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
          <CalendarIcon class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
            :class="{ 'scale-110': isActive('/citas') }" />
          <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Citas</span>
        </router-link>

        <!-- Profesionales: solo visible para Admin -->
        <router-link v-if="canSeeMedicos" to="/medicos"
          class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
          :class="isActive('/medicos') ?
            'bg-white text-teal-700 shadow-lg translate-x-2' :
            'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
          <BriefcaseIcon class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
            :class="{ 'scale-110': isActive('/medicos') }" />
          <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Profesionales</span>
        </router-link>

        <div class="pt-4 mt-4 border-t border-teal-600">
          <!-- Reportes: solo visible para Admin -->
          <router-link v-if="canSeeReportes" to="/reportes"
            class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
            :class="isActive('/reportes') ?
              'bg-white text-teal-700 shadow-lg translate-x-2' :
              'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
            <ChartBarIcon class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
              :class="{ 'scale-110': isActive('/reportes') }" />
            <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Reportes</span>
          </router-link>

          <!-- Configuración: solo visible para Admin y Asistente -->
          <router-link v-if="canSeeConfig" to="/admin"
            class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
            :class="isActive('/admin') ?
              'bg-white text-teal-700 shadow-lg translate-x-2' :
              'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
            <Cog6ToothIcon class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
              :class="{ 'scale-110': isActive('/admin') }" />
            <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Configuración</span>
          </router-link>
        </div>
      </nav>

      <!-- Usuario -->
      <div class="p-4 border-t border-teal-600">
        <div class="flex items-center gap-2">
          <!-- Avatar y datos clickeables -->
          <button @click="abrirModalPerfil"
            class="group flex items-center gap-3 flex-1 min-w-0 bg-teal-600/30 hover:bg-gradient-to-r hover:from-teal-500/50 hover:to-emerald-500/50 rounded-xl p-2 transition-all duration-300 border border-transparent hover:border-white/20"
            title="Ver mi perfil">
            <div
              class="w-11 h-11 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center flex-shrink-0 ring-2 ring-white/40 group-hover:ring-white/60 group-hover:scale-105 transition-all duration-300 shadow-lg">
              <span v-if="auth.user?.nombres_completos" class="text-white font-bold text-sm">{{ getUserInitials
              }}</span>
              <UserIcon v-else class="w-6 h-6 text-white" />
            </div>
            <div :class="{ 'md:hidden': !sidebarOpen }" class="flex-1 min-w-0 text-left">
              <p class="font-semibold truncate text-white group-hover:text-white transition-colors">
                {{ auth.user?.nombres_completos || auth.user?.dni || 'Usuario' }}
              </p>
              <p class="text-xs text-teal-200 truncate flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                {{ getUserRole }}
              </p>
            </div>
            <!-- Ícono de flecha -->
            <ChevronRightIcon :class="{ 'md:hidden': !sidebarOpen }"
              class="w-4 h-4 text-teal-200 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
          </button>
          <!-- Botón de cerrar sesión -->
          <button :class="{ 'md:hidden': !sidebarOpen }" @click="cerrarSesion"
            class="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-white transition-all duration-300 flex-shrink-0 hover:scale-105"
            title="Cerrar sesión">
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Modal de Perfil de Usuario -->
    <ModalPerfilUsuario :visible="modalPerfilVisible" :user="auth.user" @close="modalPerfilVisible = false" />

    <!-- Contenido Principal -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Mobile Menu Button -->
            <button @click="mobileMenuOpen = true"
              class="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bars3Icon class="w-6 h-6 text-gray-600" />
            </button>

            <div>
              <transition enter-active-class="transition ease-out duration-300"
                enter-from-class="opacity-0 -translate-x-2" enter-to-class="opacity-100 translate-x-0" mode="out-in">
                <h2 :key="tituloActual" class="text-xl md:text-2xl font-bold text-gray-800">{{ tituloActual }}</h2>
              </transition>
              <transition enter-active-class="transition ease-out duration-300 delay-75"
                enter-from-class="opacity-0 -translate-x-2" enter-to-class="opacity-100 translate-x-0" mode="out-in">
                <p :key="subtituloActual" class="hidden md:block text-sm text-gray-500 mt-1">{{ subtituloActual }}</p>
              </transition>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- Notificaciones (TODO: Implementar más adelante)
            <button class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <BellIcon class="w-6 h-6 text-gray-700" />
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            -->

            <!-- Usuario -->
            <div class="hidden md:flex items-center gap-2">
              <span class="text-sm font-medium text-gray-700">Hoy: {{ fechaActual }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido -->
      <main class="flex-1 p-4 md:p-6 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition enter-active-class="transition ease-out duration-300"
            enter-from-class="transform opacity-0 translate-y-4" enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-200" leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-4" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 px-6 py-3">
        <div class="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 gap-2">
          <p class="text-center md:text-left">© {{ new Date().getFullYear() }} Centro de Salud La Unión - Huánuco</p>
          <p>Versión 1.0.0</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Swal from 'sweetalert2'
import ModalPerfilUsuario from '../components/common/ModalPerfilUsuario.vue'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  XMarkIcon,
  Squares2X2Icon,
  UserGroupIcon,
  CalendarIcon,
  BriefcaseIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
  // BellIcon // TODO: Descomentar cuando se implemente notificaciones
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(true)
const mobileMenuOpen = ref(false)
const modalPerfilVisible = ref(false)

const abrirModalPerfil = () => {
  modalPerfilVisible.value = true
}

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const getUserRole = computed(() => {
  if (auth.user && auth.user.rol_id) {
    switch (auth.user.rol_id) {
      case 1:
        return 'Administrador'
      case 2:
        return 'Profesional'
      case 3:
        return 'Asistente'
      default:
        return 'Invitado'
    }
  }
  return 'Invitado'
})

// Permisos de navegación por rol
// Rol 1 = Administrador, Rol 2 = Profesional, Rol 3 = Asistente
// Profesional solo puede ver: Dashboard, Pacientes (solo listado), Citas

const canSeeMedicos = computed(() => {
  // Solo Administrador puede ver la sección de Profesionales
  return auth.user?.rol_id === 1
})

const canSeeReportes = computed(() => {
  // Solo Administrador puede ver la sección de Reportes
  return auth.user?.rol_id === 1
})

const canSeeConfig = computed(() => {
  // Solo Administrador y Asistente pueden ver Configuración
  return auth.user?.rol_id === 1 || auth.user?.rol_id === 3
})

const getUserInitials = computed(() => {
  if (auth.user?.nombres_completos) {
    const words = auth.user.nombres_completos.split(' ')
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase()
  }
  return ''
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const cerrarSesion = async () => {
  const result = await Swal.fire({
    title: '¿Cerrar sesión?',
    text: 'Estás a punto de salir del sistema',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0d9488',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    await auth.logout()
    router.push('/login')

    Swal.fire({
      title: '¡Hasta pronto!',
      text: 'Has cerrado sesión correctamente',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  }
i  const fecha = new Date()
  return fecha.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>