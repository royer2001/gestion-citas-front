<template>
    <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                    {{ saludo }},
                    <span
                        class="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                        {{ nombreUsuario }}
                    </span>
                    <HandRaisedIcon class="w-8 h-8 text-amber-400 inline-block ml-2 animate-pulse" />
                </h1>
                <p class="text-gray-500 mt-1">
                    {{ fechaCompleta }}
                </p>
            </div>
            <div class="flex items-center gap-2 text-sm">
                <span
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full font-medium">
                    <span class="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                    Sistema activo
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HandRaisedIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
    nombreUsuario: string;
}>();

const saludo = computed(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Buenos días';
    if (hora >= 12 && hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
});

const fechaCompleta = computed(() => {
    const fecha = new Date();
    const opciones: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const fechaFormateada = fecha.toLocaleDateString('es-PE', opciones);
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
});
</script>
