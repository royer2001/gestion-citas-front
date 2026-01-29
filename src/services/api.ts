// src/services/api.ts
import axios from 'axios'
import router from "../router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Incluir access token (Ahora manejado automáticamente por cookies)
api.interceptors.request.use((config) => {
  return config
})

// Auto refresh en caso de 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Evita bucles infinitos:
    // 1. Si ya se reintentó (_retry)
    // 2. Si es login (no tiene sentido refrescar)
    // 3. Si es el propio endpoint de refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/login') && !originalRequest.url?.includes('/refresh')) {
      originalRequest._retry = true;

      try {
        // solicitar nuevo access token usando la cookie refresh (el backend lo guardará en cookie access)
        await api.post("/auth/refresh");
        
        // reintentar la petición original (ahora tendrá la nueva cookie)
        return api(originalRequest);
      } catch (err) {
        // Si falla el refresh, el usuario debe re-autenticarse
        try {
          // Importación dinámica para evitar dependencia circular
          const { useAuthStore } = await import('../store/auth');
          const auth = useAuthStore();
          auth.setSession(null);
        } catch (e) {
          console.error("Error clearing session:", e);
          localStorage.removeItem('user'); // Fallback
        }
        router.push("/login");
      }
    }

    return Promise.reject(error)
  }
);

export default api;
