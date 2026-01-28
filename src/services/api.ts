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

// Incluir access token
api.interceptors.request.use((config) => {
  // No enviar Authorization header cuando se está refrescando el token
  if (config.url?.includes('/auth/refresh')) {
    return config;
  }

  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
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
    // 3. Si es el propio endpoint de refresh (si falla, no podemos refrescarnos a nosotros mismos)
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/login') && !originalRequest.url?.includes('/refresh')) {
      originalRequest._retry = true;

      try {
        // solicitar nuevo access token usando la cookie refresh
        const { data } = await api.post("/auth/refresh");
        localStorage.setItem("token", data.access_token);
        
        // reintentar la petición original
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }

    return Promise.reject(error)
  }
);

export default api;
