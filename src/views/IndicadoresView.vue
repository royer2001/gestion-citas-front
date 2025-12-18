<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-8">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Indicadores de Gestión</h1>
                        <p class="mt-1 text-sm text-gray-500">Métricas de la tesis: Utilización, Inasistencia y Lead Time</p>
                    </div>
                </div>
            </div>

            <!-- Filtros -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div class="flex items-center gap-3 mb-6">
                    <div class="p-2 bg-indigo-100 rounded-lg">
                        <FunnelIcon class="w-5 h-5 text-indigo-600" />
                    </div>
                    <h2 class="text-lg font-semibold text-gray-800">Período de Análisis</h2>
                </div>
                <div class="flex flex-col md:flex-row items-end gap-4">
                    <div class="flex-1 w-full">
                        <label class="block text-sm font-medium text-gray-600 mb-2">Rango de Fechas</label>
                        <div class="flex items-center gap-3">
                            <input type="date" v-model="filtros.fechaInicio"
                                class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                            <span class="text-gray-400 font-medium">—</span>
                            <input type="date" v-model="filtros.fechaFin"
                                class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                        </div>
                    </div>
                    <div class="flex-1 w-full">
                        <label class="block text-sm font-medium text-gray-600 mb-2">Área (Opcional)</label>
                        <select v-model="filtros.areaId"
                            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                            <option :value="null">Todas las áreas</option>
                            <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.nombre }}</option>
                        </select>
                    </div>
                    <button @click="cargarIndicadores" :disabled="loading"
                        class="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
                        <ChartBarIcon class="w-5 h-5" />
                        {{ loading ? 'Cargando...' : 'Calcular Indicadores' }}
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>

            <!-- Indicadores Cards -->
            <div v-else-if="indicadores" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- Utilización de Capacidad -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-blue-50 rounded-xl">
                            <ChartPieIcon class="w-8 h-8 text-blue-500" />
                        </div>
                        <span class="text-xs font-medium text-gray-400 uppercase">Dimensión 1</span>
                    </div>
                    <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">{{ indicadores.utilizacion_capacidad.nombre }}</p>
                    <p class="mt-2 text-4xl font-bold text-gray-900">
                        {{ indicadores.utilizacion_capacidad.valor }}<span class="text-2xl text-gray-400">%</span>
                    </p>
                    <p class="mt-2 text-xs text-gray-500">{{ indicadores.utilizacion_capacidad.descripcion }}</p>
                    <div class="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                        <p><strong>Citas programadas:</strong> {{ indicadores.utilizacion_capacidad.componentes.citas_programadas }}</p>
                        <p><strong>Cupos totales:</strong> {{ indicadores.utilizacion_capacidad.componentes.cupos_totales }}</p>
                    </div>
                </div>

                <!-- Tasa de Inasistencia -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-red-50 rounded-xl">
                            <UserMinusIcon class="w-8 h-8 text-red-500" />
                        </div>
                        <span class="text-xs font-medium text-gray-400 uppercase">Dimensión 2</span>
                    </div>
                    <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">{{ indicadores.tasa_inasistencia.nombre }}</p>
                    <p class="mt-2 text-4xl font-bold text-gray-900">
                        {{ indicadores.tasa_inasistencia.valor }}<span class="text-2xl text-gray-400">%</span>
                    </p>
                    <p class="mt-2 text-xs text-gray-500">{{ indicadores.tasa_inasistencia.descripcion }}</p>
                    <div class="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                        <p><strong>No asistieron:</strong> {{ indicadores.tasa_inasistencia.componentes.no_shows }}</p>
                        <p><strong>Citas confirmadas:</strong> {{ indicadores.tasa_inasistencia.componentes.citas_confirmadas }}</p>
                    </div>
                </div>

                <!-- Lead Time -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-amber-50 rounded-xl">
                            <ClockIcon class="w-8 h-8 text-amber-500" />
                        </div>
                        <span class="text-xs font-medium text-gray-400 uppercase">Dimensión 3</span>
                    </div>
                    <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">{{ indicadores.lead_time.nombre }}</p>
                    <p class="mt-2 text-4xl font-bold text-gray-900">
                        {{ indicadores.lead_time.valor }}<span class="text-2xl text-gray-400"> días</span>
                    </p>
                    <p class="mt-2 text-xs text-gray-500">{{ indicadores.lead_time.descripcion }}</p>
                    <div class="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                        <p><strong>Fórmula:</strong> {{ indicadores.lead_time.formula }}</p>
                    </div>
                </div>
            </div>

            <!-- Estadísticas Adicionales -->
            <div v-if="estadisticas" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div class="flex items-center gap-3 mb-6">
                    <div class="p-2 bg-emerald-100 rounded-lg">
                        <ChartBarIcon class="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Estadísticas Adicionales</h3>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-green-50 rounded-xl p-4 text-center">
                        <p class="text-2xl font-bold text-green-600">{{ estadisticas.citas_atendidas }}</p>
                        <p class="text-sm text-gray-600">Citas Atendidas</p>
                    </div>
                    <div class="bg-red-50 rounded-xl p-4 text-center">
                        <p class="text-2xl font-bold text-red-600">{{ estadisticas.citas_canceladas }}</p>
                        <p class="text-sm text-gray-600">Canceladas</p>
                    </div>
                    <div class="bg-amber-50 rounded-xl p-4 text-center">
                        <p class="text-2xl font-bold text-amber-600">{{ estadisticas.citas_no_asistio }}</p>
                        <p class="text-sm text-gray-600">No Asistieron</p>
                    </div>
                    <div class="bg-indigo-50 rounded-xl p-4 text-center">
                        <p class="text-2xl font-bold text-indigo-600">{{ estadisticas.tasa_atencion_efectiva }}%</p>
                        <p class="text-sm text-gray-600">Tasa de Atención</p>
                    </div>
                </div>
            </div>

            <!-- Gráfico de Tendencia -->
            <div v-if="tendenciaData.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-indigo-100 rounded-lg">
                            <ChartBarIcon class="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800">Tendencia de Indicadores</h3>
                    </div>
                </div>
                <div ref="trendChartContainer" class="w-full h-80"></div>
            </div>

            <!-- Comparativo por Área -->
            <div v-if="areasData.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                    <div class="p-2 bg-purple-100 rounded-lg">
                        <BuildingOfficeIcon class="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Comparativo por Área</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Área</th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Utilización</th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Inasistencia</th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Lead Time</th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Total Citas</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="area in areasData" :key="area.area_id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ area.area_nombre }}</td>
                                <td class="px-6 py-4 text-center">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        :class="getUtilizacionClass(area.utilizacion_capacidad)">
                                        {{ area.utilizacion_capacidad }}%
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        :class="getInasistenciaClass(area.tasa_inasistencia)">
                                        {{ area.tasa_inasistencia }}%
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center text-sm text-gray-700">{{ area.lead_time }} días</td>
                                <td class="px-6 py-4 text-center text-sm font-semibold text-gray-700">{{ area.detalles.total_citas }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!loading && !indicadores" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <ChartBarIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">Selecciona un período</h3>
                <p class="text-gray-500">Elige las fechas de inicio y fin para calcular los indicadores de gestión.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import * as d3 from 'd3';
import indicadorService, { type IndicadoresResponse, type DatosTendencia, type DatosArea } from '../services/indicadorService';
import areaService from '../services/areaService';
import {
    FunnelIcon, ChartBarIcon, ChartPieIcon, ClockIcon, BuildingOfficeIcon
} from '@heroicons/vue/24/outline';
import { UserMinusIcon } from '@heroicons/vue/24/solid';

interface Area {
    id: number;
    nombre: string;
}

const filtros = ref<{
    fechaInicio: string;
    fechaFin: string;
    areaId: number | null;
}>({
    fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0] as string,
    fechaFin: new Date().toISOString().split('T')[0] as string,
    areaId: null
});

const loading = ref(false);
const areas = ref<Area[]>([]);
const indicadores = ref<IndicadoresResponse['indicadores'] | null>(null);
const estadisticas = ref<IndicadoresResponse['estadisticas_adicionales'] | null>(null);
const tendenciaData = ref<DatosTendencia[]>([]);
const areasData = ref<DatosArea[]>([]);
const trendChartContainer = ref<HTMLElement | null>(null);

const cargarAreas = async () => {
    try {
        const response = await areaService.getAreas();
        areas.value = response.data;
    } catch (error) {
        console.error('Error al cargar áreas:', error);
    }
};

const cargarIndicadores = async () => {
    loading.value = true;
    try {
        const params = {
            fecha_inicio: filtros.value.fechaInicio,
            fecha_fin: filtros.value.fechaFin,
            ...(filtros.value.areaId && { area_id: filtros.value.areaId })
        };

        // Cargar indicadores principales
        const response = await indicadorService.getIndicadores(params);
        if (response.data.success) {
            indicadores.value = response.data.indicadores;
            estadisticas.value = response.data.estadisticas_adicionales;
        }

        // Cargar tendencia
        const tendenciaResponse = await indicadorService.getTendencia({ ...params, agrupacion: 'mes' });
        if (tendenciaResponse.data.success) {
            tendenciaData.value = tendenciaResponse.data.datos;
            await nextTick();
            renderTrendChart();
        }

        // Cargar comparativo por área (solo si no hay filtro de área)
        if (!filtros.value.areaId) {
            const areasResponse = await indicadorService.getPorArea(params);
            if (areasResponse.data.success) {
                areasData.value = areasResponse.data.areas;
            }
        } else {
            areasData.value = [];
        }

    } catch (error) {
        console.error('Error al cargar indicadores:', error);
    } finally {
        loading.value = false;
    }
};

const renderTrendChart = () => {
    if (!trendChartContainer.value || tendenciaData.value.length === 0) return;

    d3.select(trendChartContainer.value).selectAll('*').remove();

    const data = tendenciaData.value;
    const margin = { top: 30, right: 120, bottom: 50, left: 50 };
    const width = trendChartContainer.value.clientWidth - margin.left - margin.right;
    const height = trendChartContainer.value.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(trendChartContainer.value)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
        .range([0, width])
        .domain(data.map(d => d.periodo.substring(0, 7)));

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));

    // Línea de Utilización
    const lineUtilizacion = d3.line<DatosTendencia>()
        .x(d => x(d.periodo.substring(0, 7)) as number)
        .y(d => y(d.utilizacion_capacidad));

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('d', lineUtilizacion);

    // Línea de Inasistencia
    const lineInasistencia = d3.line<DatosTendencia>()
        .x(d => x(d.periodo.substring(0, 7)) as number)
        .y(d => y(d.tasa_inasistencia));

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('d', lineInasistencia);

    // Leyenda
    const legend = svg.append('g').attr('transform', `translate(${width + 10}, 0)`);
    legend.append('rect').attr('width', 12).attr('height', 12).attr('fill', '#3b82f6');
    legend.append('text').attr('x', 18).attr('y', 10).text('Utilización').style('font-size', '12px');
    legend.append('rect').attr('y', 20).attr('width', 12).attr('height', 12).attr('fill', '#ef4444');
    legend.append('text').attr('x', 18).attr('y', 30).text('Inasistencia').style('font-size', '12px');
};

const getUtilizacionClass = (valor: number) => {
    if (valor >= 80) return 'bg-green-100 text-green-800';
    if (valor >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
};

const getInasistenciaClass = (valor: number) => {
    if (valor <= 5) return 'bg-green-100 text-green-800';
    if (valor <= 15) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
};

onMounted(() => {
    cargarAreas();
});

watch(() => trendChartContainer.value, () => {
    if (trendChartContainer.value && tendenciaData.value.length > 0) {
        renderTrendChart();
    }
});
</script>
