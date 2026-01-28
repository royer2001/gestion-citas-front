// src/router/index.ts

import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import LoginView from "../views/Login.vue";
import PacientesView from "../views/PacientesView.vue";
import CitasView from "../views/CitasView.vue";
import MedicosView from "../views/MedicosView.vue";
import Admin from "../views/Admin.vue";
import ReportesView from "../views/ReportesView.vue";
import DashboardView from "../views/DashboardView.vue";
import { useAuthStore } from "../store/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "",
        redirect: "/dashboard",
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: DashboardView,
      },
      {
        path: "pacientes",
        name: "Pacientes",
        component: PacientesView,
      },
      {
        path: "citas",
        name: "Citas",
        component: CitasView,
      },
      {
        path: "medicos",
        name: "Medicos",
        component: MedicosView,
        meta: { roles: [1] } // Solo Administrador
      },
      {
        path: "reportes",
        name: "Reportes",
        component: ReportesView,
        meta: { roles: [1] } // Solo Administrador
      },
      {
        path: "admin",
        name: "Administrador",
        component: Admin,
        meta: { roles: [1, 3] } // Administrador o Asistente
      },
      {
        path: "manuales",
        name: "Manuales",
        component: () => import("../views/ManualesView.vue")
      },
      // Ruta para manejar errores 404 o rutas no encontradas dentro del layout
      {
        path: ":pathMatch(.*)*",
        redirect: "/dashboard"
      }
    ],
  },
  // Captura cualquier otra ruta fuera del layout y redirigir al login o dashboard
  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();
  
  // Rutas públicas (Login)
  if (to.name === "Login") {
    if (auth.isAuthenticated) {
      return next({ name: "Dashboard" });
    }
    return next();
  }

  // Si tenemos datos de usuario pero no hemos verificado la sesión (ej. F5), intentamos verificar
  if (auth.user && !auth.isAuthenticated) {
    try {
      await auth.fetchProfile();
      auth.isAuthenticated = true;
    } catch (error) {
      auth.setSession(null);
      return next({ name: "Login" });
    }
  }

  // Rutas privadas: Verificar autenticación definitiva
  if (!auth.isAuthenticated) {
    return next({ name: "Login" });
  }

  // Si por alguna razón tenemos isAuthenticated pero no el user, corregimos
  if (!auth.user && auth.isAuthenticated) {
    try {
      await auth.fetchProfile();
    } catch (error) {
      // Si falla la carga del perfil, forzamos logout por seguridad
      auth.setSession(null);
      return next({ name: "Login" });
    }
  }

  // Verificar Autorización (Roles)
  const requiredRoles = to.meta.roles as number[] | undefined;
  
  if (requiredRoles) {
    // Si la ruta requiere roles pero no hay usuario (y falló la carga anterior)
    if (!auth.user) {
      return next({ name: "Login" });
    }

    const hasRole = requiredRoles.includes(auth.user.rol_id);
    if (!hasRole) {
      console.warn(`Acceso denegado a ${to.path}. Rol requerido: ${requiredRoles}. Rol usuario: ${auth.user.rol_id}`);
      return next({ name: "Dashboard" });
    }
  }

  next();
});


export default router;