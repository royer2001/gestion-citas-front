<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div
                class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <div v-if="medico"
                                class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                                {{ medico.iniciales }}
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">{{ medico?.nombre }}</h3>
                                <p class="text-teal-100 text-sm">{{ medico?.especialidad }}</p>
                            </div>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Contenido del modal -->
                <div class="p-6 overflow-y-auto flex-1">
                    <div v-if="medico" class="space-y-4">

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">CMP</p>
                                <p class="font-semibold text-gray-800">
                                    {{ medico.cmp }}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Área</p>
                                <p class="font-semibold text-gray-800">
                                    {{ formatArea(medico.area) }}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Email</p>
                                <p class="font-semibold text-gray-800">
                                    {{ medico.email }}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Teléfono</p>
                                <p class="font-semibold text-gray-800">
                                    {{ medico.telefono }}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Horario</p>
                                <p class="font-semibold text-gray-800">
                                    {{ medico.horario }}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Cupos por Día</p>
                                <p class="font-semibold text-gray-800">
                                    {{ medico.cuposDia }}
                                </p>
                            </div>
                            <div class="col-span-2">
                                <p class="text-sm text-gray-500">Dirección</p>
                                <p class="font-semibold text-gray-800">
                                    {{ medico.direccion || "No especificada" }}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Estado</p>
                                <span :class="[
                                    'inline-block px-2 py-1 text-xs font-semibold rounded-full',
                                    medico.estado === 'activo'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800',
                                ]">
                                    {{
                                        medico.estado === "activo"
                                            ? "Activo"
                                            : "Inactivo"
                                    }}
                                </span>
                            </div>
                        </div>

                        <div class="flex gap-3 pt-4 border-t">
                            <button @click="$emit('editar', medico)"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg hover:shadow-xl">
                                Editar
                            </button>
                            <button @click="cerrar"
                                class="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Medico {
    id: number
    nombre: string
    iniciales: string
    email: string
    telefono: string
    cmp?: string
    area: string
    especialidad?: string
    horario: string
    cuposDia: number
    direccion?: string
    estado: 'activo' | 'inactivo'
}

interface Props {
    visible: boolean
    medico: Medico | null
}

defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'editar', medico: Medico): void
}>()

const cerrar = () => {
    emit('close')
}

const formatArea = (area: string): string => {
    const areas: Record<string, string> = {
        odontologia: "Odontología",
        psicologia: "Psicología",
        nutricion: "Nutrición",
        medicina_general: "Medicina General",
    }
    return areas[area] || area
}
</script>
