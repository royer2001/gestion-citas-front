<template>
    <div
        class="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-600 to-emerald-600 relative flex-col items-center justify-center text-white p-12 overflow-hidden">
        <!-- Abstract Circles Background -->
        <div class="absolute top-0 left-0 w-full h-full opacity-10">
            <div class="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
            <div class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-200 blur-3xl"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 text-center">
            <div
                class="mb-8 w-48 h-48 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto shadow-inner border border-white/20">
                <BuildingOfficeIcon class="w-24 h-24 text-white" />
            </div>
            <h2 class="text-3xl font-bold mb-2 tracking-tight">Centro de Salud</h2>
            <h1 class="text-4xl font-extrabold mb-6 tracking-wide">La Unión</h1>
            <p class="text-teal-50 text-lg max-w-xs mx-auto leading-relaxed">
                Gestión integral de citas médicas, pacientes y personal de salud.
            </p>
        </div>

        <!-- Decoration Dots -->
        <div class="absolute bottom-10 left-10 flex gap-2">
            <div class="w-2 h-2 rounded-full bg-white/50"></div>
            <div class="w-2 h-2 rounded-full bg-white/30"></div>
            <div class="w-2 h-2 rounded-full bg-white/10"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BuildingOfficeIcon } from "@heroicons/vue/24/outline";
</script>
