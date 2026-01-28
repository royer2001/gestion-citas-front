<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Tabs de navegación -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button @click="activeTab = 'administracion'" :class="[
            activeTab === 'administracion'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200'
          ]">
            <CalendarIcon class="w-5 h-5" />
            Administración de Citas
          </button>
          <!-- Imprimir: solo visible para Admin y Asistente -->
          <button v-if="canSeePrintTab" @click="activeTab = 'imprimir'" :class="[
            activeTab === 'imprimir'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200'
          ]">
            <PrinterIcon class="w-5 h-5" />
            Imprimir Citas Confirmadas
          </button>
        </nav>
      </div>
    </div>

    <!-- ==================== TAB: ADMINISTRACIÓN DE CITAS ==================== -->
    <div v-show="activeTab === 'administracion'">
      <!-- Banner informativo para profesionales -->
      <div v-if="isProfesional" class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UserCircleIcon class="h-5 w-5 text-blue-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
              <span class="font-medium">Panel del Profesional:</span>
              El listado muestra las citas <strong>confirmadas</strong> bajo su responsabilidad y aquellas que usted ha
              procesado (atendidas, referidas o no asistió).
            </p>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-100 rounded-lg">
              <FunnelIcon class="w-5 h-5 text-emerald-600" />
            </div>
            <h2 class="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h2>
          </div>
          <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="hayFiltrosActivos"
              class="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold animate-pulse">
              <SparklesIcon class="w-3.5 h-3.5" />
              FILTROS ACTIVADOS
            </div>
          </transition>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Filtro por fecha de cita -->
          <div>
            <label for="filtroFecha" class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Cita
            </label>
            <input type="date" id="filtroFecha" v-model="filtros.fecha"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              :class="filtros.fecha ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300'" />
          </div>

          <!-- Filtro por área (dinámico) - Oculto para profesionales -->
          <div v-if="!isProfesional">
            <label for="filtroArea" class="block text-sm font-medium text-gray-700 mb-2">
              Área
            </label>
            <select id="filtroArea" v-model="filtros.area"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200"
              :class="filtros.area ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300'">
              <option value="">Todas las áreas</option>
              <option v-for="area in areas" :key="area.id" :value="area.nombre">
                {{ area.nombre }}
              </option>
            </select>
          </div>

          <!-- Filtro por turno -->
          <div>
            <label for="filtroTurno" class="block text-sm font-medium text-gray-700 mb-2">
              Turno
            </label>
            <select id="filtroTurno" v-model="filtros.turno"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200"
              :class="filtros.turno ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300'">
              <option value="">Todos los turnos</option>
              <option value="M">Mañana</option>
              <option value="T">Tarde</option>
            </select>
          </div>

          <!-- Filtro por estado -->
          <div>
            <label for="filtroEstado" class="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select id="filtroEstado" v-model="filtros.estado"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200"
              :class="filtros.estado ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300'">
              <option value="">Todos los estados</option>
              <option v-for="est in estadosCita" :key="est.id" :value="est.nombre">
                {{ est.nombre.charAt(0).toUpperCase() + est.nombre.slice(1) }}
              </option>
            </select>
          </div>

          <!-- Buscar por paciente (DNI) -->
          <div>
            <label for="filtroPaciente" class="block text-sm font-medium text-gray-700 mb-2">
              DNI Paciente
            </label>
            <input type="text" id="filtroPaciente" v-model="filtros.paciente_dni" placeholder="DNI del paciente"
              maxlength="8"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              :class="filtros.paciente_dni ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-300'" />
          </div>
        </div>

        <div class="flex gap-3 mt-4">
          <button @click="aplicarFiltros"
            class="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2">
            <MagnifyingGlassIcon class="w-5 h-5" />
            Buscar
          </button>
          <button @click="limpiarFiltros"
            class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2">
            <XMarkIcon class="w-5 h-5" />
            Limpiar
          </button>
        </div>
      </div>

      <!-- Tabla de citas -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha / Turno
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesional
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
              <tr v-if="isLoading">
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <ArrowPathIcon class="w-10 h-10 text-emerald-500 mb-3 animate-spin" />
                    <span class="text-gray-500 font-medium">Cargando citas...</span>
                  </div>
                </td>
              </tr>
              <template v-else>
                <tr v-for="cita in citas" :key="cita.id" class="hover:bg-gray-50 transition duration-150">
                  <!-- Fecha y Turno -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="cita.fecha" class="text-sm font-medium text-gray-900">
                      {{ formatFecha(cita.fecha) }}
                    </div>
                    <div v-else class="text-sm font-medium text-gray-500">
                      Sin programar
                    </div>
                    <!-- Mostrar turno si existe -->
                    <div v-if="cita.horario_turno" class="mt-1">
                      <span :class="[
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                        cita.horario_turno === 'M'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      ]">
                        <SunIcon v-if="cita.horario_turno === 'M'" class="w-3 h-3 mr-1" />
                        <MoonIcon v-else class="w-3 h-3 mr-1" />
                        {{ cita.horario_turno_nombre }}
                      </span>
                    </div>
                    <!-- Horario si existe -->
                    <div v-if="cita.horario" class="text-xs text-gray-500 mt-1">
                      {{ cita.horario.hora_inicio?.slice(0, 5) }} - {{ cita.horario.hora_fin?.slice(0, 5) }}
                    </div>
                  </td>
                  <!-- Paciente -->
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ getNombreCompleto(cita.paciente) }}</div>
                    <div class="text-sm text-gray-500">DNI: {{ cita.paciente?.dni || 'N/A' }}</div>
                    <div v-if="cita.paciente?.telefono" class="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <PhoneIcon class="w-3 h-3" />
                      {{ cita.paciente.telefono }}
                    </div>
                  </td>
                  <!-- Área -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ cita.area_nombre || cita.area || 'N/A' }}</div>
                  </td>
                  <!-- Profesional -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ cita.doctor_nombre || 'Sin asignar' }}</div>
                  </td>
                  <!-- Estado -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getEstadoClass(cita)">
                      {{ formatEstado(cita.estado) }}
                    </span>
                  </td>
                  <!-- Acciones -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <div v-if="procesandoCitaId === cita.id"
                      class="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      <ArrowPathIcon class="w-4 h-4 animate-spin" />
                      <span class="text-xs font-medium">Procesando...</span>
                    </div>
                    <div v-else class="flex gap-2 lg:gap-3">
                      <!-- Ver detalle: disponible para todos -->
                      <button @click="verDetalle(cita)"
                        class="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Ver detalle">
                        <EyeIcon class="w-5 h-5" />
                      </button>

                      <!-- Confirmar cita: solo Admin y Asistente -->
                      <button v-if="canUseManagementActions && cita.estado === 'pendiente'"
                        @click="confirmarCita(cita.id)"
                        class="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Confirmar cita">
                        <CheckIcon class="w-5 h-5" />
                      </button>

                      <!-- Marcar como atendida: solo Admin y Médico -->
                      <button
                        v-if="canUseMedicalActions && !['atendida', 'cancelada', 'referido', 'no_asistio'].includes(cita.estado)"
                        @click="cambiarEstado(cita.id, 'atendida')"
                        class="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Marcar como atendida">
                        <CheckCircleIcon class="w-5 h-5" />
                      </button>

                      <!-- Referir: solo Admin y Médico -->
                      <button
                        v-if="canUseMedicalActions && !['atendida', 'cancelada', 'referido', 'no_asistio'].includes(cita.estado)"
                        @click="cambiarEstado(cita.id, 'referido')"
                        class="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Referir a otro hospital">
                        <PaperAirplaneIcon class="w-5 h-5" />
                      </button>

                      <!-- Marcar como No Asistió: solo Admin y Médico -->
                      <button
                        v-if="canUseMedicalActions && !['atendida', 'cancelada', 'referido', 'no_asistio'].includes(cita.estado)"
                        @click="cambiarEstado(cita.id, 'no_asistio')"
                        class="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Marcar como No Asistió">
                        <XCircleIcon class="w-5 h-5" />
                      </button>

                      <!-- Cancelar cita: solo Admin y Asistente -->
                      <button
                        v-if="canUseManagementActions && !['atendida', 'cancelada', 'referido', 'no_asistio'].includes(cita.estado)"
                        @click="cancelarCita(cita.id)"
                        class="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Cancelar cita">
                        <XMarkIcon class="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="citas.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                      <CalendarIcon class="w-10 h-10 text-gray-300 mb-3" />
                      <p>No se encontraron citas con los filtros aplicados</p>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalItems > 0"
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
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
              de
              <span class="font-medium">{{ totalItems }}</span>
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
                <ChevronLeftIcon class="w-4 h-4" />
              </button>

              <button v-for="page in paginationPages" :key="page" @click="currentPage = page"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                :class="page === currentPage ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'">
                {{ page }}
              </button>

              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                <span class="sr-only">Siguiente</span>
                <ChevronRightIcon class="w-4 h-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== TAB: IMPRIMIR CITAS CONFIRMADAS ==================== -->
    <div v-show="activeTab === 'imprimir'">
      <!-- Filtros para impresión -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-emerald-100 rounded-lg">
            <FunnelIcon class="w-5 h-5 text-emerald-600" />
          </div>
          <h2 class="text-lg font-semibold text-gray-800">Filtros para Impresión</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Filtro por fecha -->
          <div>
            <label for="imprimirFecha" class="block text-sm font-medium text-gray-700 mb-2">
              <CalendarDaysIcon class="w-4 h-4 inline mr-1 text-gray-400" />
              Fecha de Cita
            </label>
            <input type="date" id="imprimirFecha" v-model="filtrosImprimir.fecha"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
          </div>

          <!-- Filtro por área -->
          <div>
            <label for="imprimirArea" class="block text-sm font-medium text-gray-700 mb-2">
              <BuildingOffice2Icon class="w-4 h-4 inline mr-1 text-gray-400" />
              Área / Servicio
            </label>
            <select id="imprimirArea" v-model="filtrosImprimir.area_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200">
              <option value="">Seleccione un área</option>
              <option v-for="area in areas" :key="area.id" :value="area.id">
                {{ area.nombre }}
              </option>
            </select>
          </div>

          <!-- Filtro por Médico (Obligatorio) -->
          <div v-if="filtrosImprimir.area_id">
            <label class="block text-sm font-medium text-gray-700 mb-2 flex justify-between">
              <span>
                <i class="pi pi-user-md mr-1 text-emerald-600"></i>
                Profesional <span class="text-red-500">*</span>
              </span>
              <span v-if="isLoadingMedicos" class="text-xs text-emerald-600 flex items-center animate-pulse">
                Cargando...
              </span>
            </label>
            <div class="relative">
              <select v-model="filtrosImprimir.medico_id" :disabled="isLoadingMedicos"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-400">
                <option :value="null">Seleccione un médico</option>
                <option v-for="medico in medicosFiltrados" :key="medico.id" :value="medico.id">
                  {{ medico.name }}
                </option>
              </select>
              <div v-if="isLoadingMedicos" class="absolute right-3 top-3">
                <ArrowPathIcon class="w-5 h-5 text-emerald-500 animate-spin" />
              </div>
            </div>
          </div>

          <!-- Botón de buscar -->
          <div>
            <label class="block text-sm font-medium text-transparent mb-2 select-none">
              &nbsp;
            </label>
            <button @click="buscarCitasConfirmadas"
              :disabled="!filtrosImprimir.fecha || !filtrosImprimir.area_id || !filtrosImprimir.medico_id || isLoadingImprimir"
              class="w-full px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
              <MagnifyingGlassIcon class="w-5 h-5" />
              Buscar Citas
            </button>
          </div>
        </div>
      </div>

      <!-- Alerta Inline -->
      <div v-if="filterAlert.show" class="mb-6 rounded-lg p-4 flex items-center gap-3 shadow-sm border" :class="{
        'bg-blue-50 text-blue-800 border-blue-200': filterAlert.type === 'info',
        'bg-red-50 text-red-800 border-red-200': filterAlert.type === 'error',
        'bg-yellow-50 text-yellow-800 border-yellow-200': filterAlert.type === 'warning'
      }">
        <ExclamationTriangleIcon v-if="filterAlert.type === 'warning' || filterAlert.type === 'error'"
          class="w-5 h-5" />
        <div v-else
          class="w-5 h-5 flex items-center justify-center bg-blue-200 rounded-full text-blue-700 text-xs font-bold">i
        </div>
        <p class="text-sm font-medium">{{ filterAlert.message }}</p>
        <button @click="filterAlert.show = false" class="ml-auto text-current opacity-70 hover:opacity-100">
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>

      <!-- Resultados para impresión -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <!-- Header de resultados -->
        <div class="bg-teal-600 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <ClipboardDocumentListIcon class="w-6 h-6 text-white" />
            <h3 class="text-lg font-semibold text-white">
              Citas Confirmadas
              <span v-if="citasConfirmadas.length > 0" class="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                {{ citasConfirmadas.length }}
              </span>
            </h3>
          </div>
          <button v-if="citasConfirmadas.length > 0" @click="imprimir" :disabled="isDownloadingPDF"
            class="px-4 py-2 bg-white text-emerald-600 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-wait">
            <ArrowPathIcon v-if="isDownloadingPDF" class="w-5 h-5 animate-spin" />
            <PrinterIcon v-else class="w-5 h-5" />
            {{ isDownloadingPDF ? 'Generando PDF...' : 'Imprimir PDF' }}
          </button>
        </div>

        <!-- Estado de carga (Skeleton) -->
        <div v-if="isLoadingImprimir" class="w-full">
          <div class="animate-pulse">
            <div class="h-10 bg-gray-100 border-b border-gray-200 flex px-4">
              <div class="w-12 h-4 bg-gray-200 rounded my-auto mr-4"></div>
              <div class="w-1/4 h-4 bg-gray-200 rounded my-auto mr-4"></div>
              <div class="w-1/6 h-4 bg-gray-200 rounded my-auto mr-4"></div>
              <div class="w-1/6 h-4 bg-gray-200 rounded my-auto mr-4"></div>
              <div class="w-1/6 h-4 bg-gray-200 rounded my-auto mr-4"></div>
              <div class="w-1/6 h-4 bg-gray-200 rounded my-auto"></div>
            </div>
            <div v-for="i in 5" :key="i" class="h-16 border-b border-gray-100 flex px-4 items-center">
              <div class="w-8 h-8 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
              <div class="flex-1 space-y-2 py-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>
          <p class="text-center text-gray-500 text-sm py-4">Cargando resultados...</p>
        </div>

        <!-- Estado vacío inicial -->
        <div v-else-if="!hasBuscadoImprimir" class="px-6 py-16 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <DocumentMagnifyingGlassIcon class="w-10 h-10 text-gray-400" />
          </div>
          <p class="text-gray-500 font-medium">Seleccione una fecha y un área para buscar citas confirmadas</p>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="citasConfirmadas.length === 0" class="px-6 py-16 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
            <ExclamationTriangleIcon class="w-10 h-10 text-yellow-500" />
          </div>
          <p class="text-gray-500 font-medium">No se encontraron citas confirmadas para la fecha y área seleccionada</p>
        </div>

        <!-- Tabla de resultados (vista previa) -->
        <div v-else>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                    N°
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    DNI
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hora
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Registrado
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="cita in citasConfirmadas" :key="cita.id" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 font-bold rounded-full">
                      {{ cita.numero }}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getNombreCompletoImprimir(cita.paciente) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-600 font-mono">
                      {{ cita.paciente?.dni || 'N/A' }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-600">
                      {{ cita.paciente?.telefono || '-' }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-1">
                      <ClockIcon class="w-4 h-4 text-gray-400" />
                      <span class="text-sm font-medium text-gray-700">
                        {{ formatHora(cita.horario?.hora_inicio) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span class="text-xs text-gray-500">
                      {{ formatFechaRegistro(cita.fecha_registro) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Nota informativa -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p class="text-sm text-gray-600 flex items-center gap-2">
              <PrinterIcon class="w-4 h-4" />
              Haz clic en "Imprimir PDF" para generar el documento listo para imprimir
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detalle de Cita -->
    <ModalDetalleCita :visible="modalDetalle.visible" :loading="modalDetalle.loading" :cita="modalDetalle.cita"
      :can-use-medical-actions="canUseMedicalActions" :can-use-management-actions="canUseManagementActions"
      @close="cerrarModal" @confirmar="confirmarCita" @cambiar-estado="cambiarEstado" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import citaService, { type CitaConfirmadaItem } from '../services/citaService'
import api from '../services/api'
import medicoService, { type Medico } from '../services/medicoService'
import catalogoService, { type EstadoCita } from '../services/catalogoService'
import ModalDetalleCita from '../components/citas/ModalDetalleCita.vue'
import { useAuthStore } from '../store/auth'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  PhoneIcon,
  EyeIcon,
  CheckIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  CalendarIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PrinterIcon,
  FunnelIcon,
  SparklesIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

// ==================== INTERFACES ====================

interface Paciente {
  id: number
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  dni: string
  telefono?: string | null
  email?: string | null
  fecha_nacimiento?: string | null
  sexo?: string
  direccion?: string
  seguro?: string | null
}

interface Horario {
  id: number
  turno: 'M' | 'T'
  turno_nombre: string
  hora_inicio: string
  hora_fin: string
  cupos?: number
}

interface Cita {
  id: number
  paciente_id: number
  horario_id: number | null
  doctor_id: number | null
  area_id: number | null
  area: string | null
  area_nombre: string | null
  fecha: string | null
  fecha_registro: string
  sintomas: string
  estado: string
  doctor_nombre: string | null
  horario_turno: 'M' | 'T' | null
  horario_turno_nombre: string | null
  dni_acompanante: string | null
  nombre_acompanante: string | null
  telefono_acompanante: string | null
  observaciones?: string
  paciente?: Paciente
  horario?: Horario
  estado_info?: {
    id: number
    nombre: string
    descripcion: string
    color: string
  }
}

interface Area {
  id: number
  nombre: string
  descripcion?: string
  activo: boolean
}

interface Filtros {
  fecha: string
  area: string
  turno: '' | 'M' | 'T'
  estado: string
  paciente_dni: string
}

interface FiltrosImprimir {
  fecha: string
  area_id: number | ''
  medico_id: number | null
}

// ==================== STATE ====================

// Auth store para verificar permisos por rol
const auth = useAuthStore()

// Permisos diferenciados por rol:
// Rol 1 = Administrador (todas las acciones)
// Rol 2 = Médico (ver detalle, atendida, referido, no_asistió)
// Rol 3 = Asistente (ver detalle, confirmar, cancelar)

// Permiso para acciones médicas: Atendida, Referido, No Asistió
// Solo Admin y Médico
const canUseMedicalActions = computed(() => {
  return auth.user?.rol_id === 1 || auth.user?.rol_id === 2
})

// Permiso para acciones de gestión: Confirmar, Cancelar
// Solo Admin y Asistente
const canUseManagementActions = computed(() => {
  return auth.user?.rol_id === 1 || auth.user?.rol_id === 3
})

// Permiso para ver pestaña de Imprimir Citas
// Solo Admin y Asistente (el Médico no puede imprimir)
const canSeePrintTab = computed(() => {
  return auth.user?.rol_id === 1 || auth.user?.rol_id === 3
})

// Indicador de si el usuario es un profesional
// Si es profesional, el backend filtra automáticamente las citas asignadas a él
const isProfesional = computed(() => {
  return auth.user?.rol_id === 2
})

// Tab activo
const activeTab = ref<'administracion' | 'imprimir'>('administracion')

// Filtros para administración
const filtros = ref<Filtros>({
  fecha: '',
  area: '',
  turno: '',
  estado: '',
  paciente_dni: ''
})

const filtrosImprimir = ref<FiltrosImprimir>({
  fecha: new Date().toISOString().split('T')[0] ?? '',
  area_id: '',
  medico_id: null
})

const modalDetalle = ref<{
  visible: boolean
  loading: boolean
  cita: Cita | null
}>({
  visible: false,
  loading: false,
  cita: null
})

// Catálogo de estados
const estadosCita = ref<EstadoCita[]>([])

// Estado de administración
const citas = ref<Cita[]>([])
const areas = ref<Area[]>([])
const totalItems = ref(0)
const totalPages = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isLoading = ref(false)
const procesandoCitaId = ref<number | null>(null)

const filterAlert = ref<{
  show: boolean
  message: string
  type: 'info' | 'error' | 'warning'
}>({
  show: false,
  message: '',
  type: 'info'
})

// Estado de impresión
const citasConfirmadas = ref<CitaConfirmadaItem[]>([])
const areaConfirmada = ref<{ id: number; nombre: string } | null>(null)
const isLoadingImprimir = ref(false)
const isLoadingMedicos = ref(false)
const hasBuscadoImprimir = ref(false)

const medicosFiltrados = ref<Medico[]>([])

// ==================== COMPUTED ====================

const hayFiltrosActivos = computed(() => {
  return !!(filtros.value.fecha || filtros.value.area || filtros.value.turno || filtros.value.estado || filtros.value.paciente_dni)
})

const paginationPages = computed(() => {
  const pages: number[] = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  const end = Math.min(totalPages.value, start + maxPages - 1)

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// ==================== MÉTODOS COMPARTIDOS ====================

const fetchAreas = async () => {
  try {
    const { data } = await api.get<Area[]>('/areas/')
    areas.value = data.filter(a => a.activo)
  } catch (error) {
    console.error('Error al cargar áreas:', error)
  }
}

const fetchEstados = async () => {
  try {
    const { data } = await catalogoService.getEstadosCita()
    estadosCita.value = data
  } catch (error) {
    console.error('Error al cargar estados:', error)
  }
}

// ==================== MÉTODOS TAB ADMINISTRACIÓN ====================

const fetchCitas = async () => {
  isLoading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: itemsPerPage.value,
      fecha: filtros.value.fecha || undefined,
      area: filtros.value.area || undefined,
      turno: (filtros.value.turno || undefined) as 'M' | 'T' | undefined,
      estado: filtros.value.estado || undefined,
      paciente_dni: filtros.value.paciente_dni || undefined
    }

    const { data } = await citaService.getCitas(params)

    citas.value = data.data
    totalItems.value = data.total
    totalPages.value = data.pages
    currentPage.value = data.current_page
  } catch (error) {
    console.error('Error al cargar citas:', error)
  } finally {
    isLoading.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

watch(currentPage, () => {
  fetchCitas()
})

watch(itemsPerPage, () => {
  currentPage.value = 1
  fetchCitas()
})

const formatFecha = (fechaStr: string): string => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr + 'T00:00:00')
  return fecha.toLocaleDateString('es-PE', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatEstado = (estado: string): string => {
  const estados: Record<string, string> = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    atendida: 'Atendida',
    cancelada: 'Cancelada',
    referido: 'Referido',
    no_asistio: 'No Asistió'
  }
  return estados[estado] || (estado.charAt(0).toUpperCase() + estado.slice(1))
}

const getEstadoClass = (cita: Cita): string => {
  const color = cita.estado_info?.color || 'gray'
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    teal: 'bg-teal-100 text-teal-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    slate: 'bg-slate-100 text-slate-800'
  }
  const baseClass = colorMap[color] || 'bg-gray-100 text-gray-800'
  return `px-2 py-1 text-xs font-semibold rounded-full ${baseClass}`
}

const aplicarFiltros = () => {
  currentPage.value = 1
  fetchCitas()
}

const limpiarFiltros = () => {
  filtros.value = {
    fecha: '',
    area: '',
    turno: '',
    estado: '',
    paciente_dni: ''
  }
  aplicarFiltros()
}

const verDetalle = async (cita: Cita) => {
  modalDetalle.value.visible = true
  modalDetalle.value.loading = true
  modalDetalle.value.cita = null

  try {
    const { data } = await citaService.getCita(cita.id)
    modalDetalle.value.cita = data as Cita
  } catch (error) {
    console.error('Error al obtener detalle de cita:', error)
    cerrarModal()
  } finally {
    modalDetalle.value.loading = false
  }
}

const cerrarModal = () => {
  modalDetalle.value.visible = false
  modalDetalle.value.loading = false
  modalDetalle.value.cita = null
}

const confirmarCita = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Confirmar cita?',
    text: "La cita pasará a estado confirmada",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10B981',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    procesandoCitaId.value = id
    try {
      await citaService.actualizarCita(id, { estado: 'confirmada' })
      await fetchCitas()
      if (modalDetalle.value.visible) cerrarModal()
      Swal.fire({
        title: '¡Confirmada!',
        text: 'La cita ha sido confirmada exitosamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error al confirmar cita:', error)
      Swal.fire('Error', 'No se pudo confirmar la cita', 'error')
    } finally {
      procesandoCitaId.value = null
    }
  }
}

const cambiarEstado = async (id: number, nuevoEstado: string) => {
  const estadosLabel: Record<string, string> = {
    'atendida': 'Atendida',
    'referido': 'Referido',
    'cancelada': 'Cancelada',
    'no_asistio': 'No Asistió'
  }

  const colors: Record<string, string> = {
    'atendida': '#8B5CF6',
    'referido': '#F97316',
    'cancelada': '#EF4444',
    'no_asistio': '#64748B'
  }

  const result = await Swal.fire({
    title: `¿Marcar como ${estadosLabel[nuevoEstado]}?`,
    text: `La cita cambiará a estado ${nuevoEstado}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: colors[nuevoEstado] || '#3B82F6',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Sí, cambiar estado',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    procesandoCitaId.value = id
    try {
      await citaService.actualizarCita(id, { estado: nuevoEstado })
      await fetchCitas()
      if (modalDetalle.value.visible) cerrarModal()
      Swal.fire({
        title: '¡Actualizado!',
        text: `La cita ha sido marcada como ${estadosLabel[nuevoEstado]}.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error(`Error al cambiar estado a ${nuevoEstado}:`, error)
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error')
    } finally {
      procesandoCitaId.value = null
    }
  }
}

const cancelarCita = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Cancelar esta cita?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Sí, cancelar cita',
    cancelButtonText: 'No, mantener'
  })

  if (result.isConfirmed) {
    procesandoCitaId.value = id
    try {
      await citaService.actualizarCita(id, { estado: 'cancelada' })
      await fetchCitas()
      Swal.fire({
        title: 'Cancelada',
        text: 'La cita ha sido cancelada.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error al cancelar cita:', error)
      Swal.fire('Error', 'No se pudo cancelar la cita', 'error')
    } finally {
      procesandoCitaId.value = null
    }
  }
}

const getNombreCompleto = (p: Paciente | undefined) => {
  if (!p) return 'Desconocido'
  return `${p.nombres} ${p.apellido_paterno} ${p.apellido_materno}`
}

// ==================== MÉTODOS TAB IMPRESIÓN ====================

const buscarCitasConfirmadas = async () => {
  if (!filtrosImprimir.value.fecha || !filtrosImprimir.value.area_id) return

  isLoadingImprimir.value = true
  hasBuscadoImprimir.value = true

  try {
    const params = {
      fecha: filtrosImprimir.value.fecha,
      area_id: filtrosImprimir.value.area_id as number,
      medico_id: filtrosImprimir.value.medico_id
    }

    const { data } = await citaService.getCitasConfirmadas(params)
    citasConfirmadas.value = data.citas
    areaConfirmada.value = data.area

    if (data.citas.length === 0) {
      filterAlert.value = {
        show: true,
        message: 'No se encontraron citas confirmadas con los filtros seleccionados.',
        type: 'info'
      }
    }
  } catch (error) {
    console.error('Error al buscar citas confirmadas:', error)
    citasConfirmadas.value = []
    areaConfirmada.value = null
    filterAlert.value = {
      show: true,
      message: 'Ocurrió un error al buscar las citas. Por favor intente nuevamente.',
      type: 'error'
    }
  } finally {
    isLoadingImprimir.value = false
  }
}

const getNombreCompletoImprimir = (paciente: CitaConfirmadaItem['paciente'] | undefined): string => {
  if (!paciente) return 'Desconocido'
  return `${paciente.apellido_paterno} ${paciente.apellido_materno}, ${paciente.nombres}`
}

const formatHora = (hora: string | undefined): string => {
  if (!hora) return '-'
  return hora.slice(0, 5)
}

const formatFechaRegistro = (fechaStr: string): string => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Estado de descarga de PDF
const isDownloadingPDF = ref(false)

// Función para abrir PDF en nueva pestaña
const imprimir = async () => {
  if (!filtrosImprimir.value.fecha || !filtrosImprimir.value.area_id) return

  isDownloadingPDF.value = true

  try {
    const params = {
      fecha: filtrosImprimir.value.fecha,
      area_id: filtrosImprimir.value.area_id as number,
      medico_id: filtrosImprimir.value.medico_id
    }

    const response = await citaService.descargarPDFCitasConfirmadas(params)

    // Crear blob y abrir en nueva pestaña
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)

    // Abrir en nueva pestaña para imprimir
    window.open(url, '_blank')

    // Revocar URL después de un tiempo
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 1000)

  } catch (error) {
    console.error('Error al generar PDF:', error)
    Swal.fire({
      title: 'Error',
      text: 'No se pudo generar el PDF de citas confirmadas',
      icon: 'error',
      confirmButtonColor: '#10B981'
    })
  } finally {
    isDownloadingPDF.value = false
  }
}

// ==================== LIFECYCLE ====================

// Cargar médicos por área desde la API
const fetchMedicosPorArea = async (areaId: number) => {
  isLoadingMedicos.value = true
  try {
    // El servicio retorna directamente el array de médicos, no un objeto {data}
    const medicos = await medicoService.getMedicos({ area_id: areaId })
    medicosFiltrados.value = medicos

    if (medicos.length === 0) {
      filterAlert.value = {
        show: true,
        message: 'No se encontraron médicos registrados en esta área.',
        type: 'warning'
      }
    }
  } catch (error) {
    console.error('Error al cargar médicos del área:', error)
    medicosFiltrados.value = []
    filterAlert.value = {
      show: true,
      message: 'No se pudo cargar la lista de médicos.',
      type: 'error'
    }
  } finally {
    isLoadingMedicos.value = false
  }
}

onMounted(() => {
  fetchAreas()
  fetchEstados()
  fetchCitas()
})

// Filtrar médicos cuando cambia el área ("Imprimir")
watch(() => filtrosImprimir.value.area_id, async (newVal) => {
  filtrosImprimir.value.medico_id = null // Resetear selección
  medicosFiltrados.value = [] // Limpiar lista actual
  filterAlert.value.show = false // Ocultar alertas previas

  if (newVal) {
    await fetchMedicosPorArea(Number(newVal))
  }
})

// Auto-recargar tabla cuando se selecciona un médico
watch(() => filtrosImprimir.value.medico_id, () => {
  if (filtrosImprimir.value.fecha && filtrosImprimir.value.area_id) {
    buscarCitasConfirmadas()
  }
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>