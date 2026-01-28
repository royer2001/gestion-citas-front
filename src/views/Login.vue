<!-- src/views/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <!-- Main Card Container -->
    <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl flex overflow-hidden min-h-[600px]">
      <!-- Left Side: Visual/Context -->
      <LoginHero />

      <!-- Right Side: Login Form -->
      <LoginForm @success="handleSuccess" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import LoginHero from "../components/auth/LoginHero.vue";
import LoginForm from "../components/auth/LoginForm.vue";

const auth = useAuthStore();
const router = useRouter();

// Verificar si ya está autenticado al cargar el componente
onMounted(() => {
  if (auth.isAuthenticated) {
    redirectUser();
  }
});

const redirectUser = () => {
  // Logic for redirection based on role could be expanded here
  // For now, everyone goes to dashboard, but if we had /admin:

  if (auth.hasRole("administrador")) {
    // If there was a specific admin route, we could go there.
    // For now, the dashboard handles it or /admin exists
    // router.push({ name: "Administrador" }); 
    // Using /dashboard based on current common flow
  }

  router.replace({ path: "/dashboard" });
};

const handleSuccess = () => {
  redirectUser();
};
</script>
