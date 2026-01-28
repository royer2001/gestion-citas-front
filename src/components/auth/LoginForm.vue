<template>
    <div class="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white relative">
        <div class="max-w-md mx-auto w-full">
            <!-- Mobile visual aid -->
            <div class="md:hidden text-center mb-8">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-3 text-teal-600">
                    <BuildingOfficeIcon class="w-8 h-8" />
                </div>
                <h2 class="text-xl font-bold text-gray-800">C.S. La Unión</h2>
            </div>

            <h2 class="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h2>
            <p class="text-gray-500 mb-6">Ingresa a tu cuenta para continuar</p>

            <!-- Error Message Container -->
            <div class="min-h-[52px] mb-4">
                <transition enter-active-class="transition ease-out duration-300"
                    enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2">
                    <div v-if="error"
                        class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                        <ExclamationCircleIcon class="w-5 h-5 flex-shrink-0" />
                        <span class="flex-1">{{ error }}</span>
                    </div>
                </transition>
            </div>

            <form @submit.prevent="onSubmit" class="flex flex-col">
                <!-- DNI Input -->
                <div class="space-y-2 mb-4">
                    <label for="dni" class="text-sm font-semibold text-gray-700 ml-1">Usuario / DNI</label>
                    <div class="relative group">
                        <div
                            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-teal-600">
                            <IdentificationIcon
                                class="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                        </div>
                        <input id="dni" v-model="dni" v-bind="dniAttrs" type="text" maxlength="8" inputmode="numeric"
                            pattern="\d{8}" @input="onDniInput"
                            class="block w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 font-medium text-gray-700 placeholder-gray-400"
                            :class="errors.dni ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'"
                            placeholder="Ingrese su DNI (8 dígitos)" />
                    </div>
                    <div class="h-6">
                        <span v-if="errors.dni" class="text-red-500 text-xs ml-1 block">{{ errors.dni }}</span>
                    </div>
                </div>

                <!-- Password Input -->
                <div class="space-y-2 mb-6">
                    <label for="password" class="text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
                    <div class="relative group">
                        <div
                            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-teal-600">
                            <LockClosedIcon
                                class="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                        </div>
                        <input id="password" v-model="password" v-bind="passwordAttrs"
                            :type="showPassword ? 'text' : 'password'"
                            class="block w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 font-medium text-gray-700 placeholder-gray-400"
                            :class="errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'"
                            placeholder="••••••••" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-teal-600 focus:outline-none transition-colors">
                            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                            <EyeSlashIcon v-else class="w-5 h-5" />
                        </button>
                    </div>
                    <div class="h-6">
                        <span v-if="errors.password" class="text-red-500 text-xs ml-1 block">{{ errors.password
                            }}</span>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" :disabled="isLoading"
                    class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-600/40 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 flex items-center justify-center gap-2 mb-6">
                    <ArrowPathIcon v-if="isLoading" class="animate-spin h-5 w-5" />
                    <span>{{ isLoading ? "Iniciando..." : "Iniciar Sesión" }}</span>
                </button>

                <!-- Contact Admin Hint -->
                <div class="text-sm text-center text-gray-500">
                    En caso de olvidar su contraseña, <br class="sm:hidden" />
                    <span class="text-teal-600 font-medium cursor-pointer hover:underline">
                        contacte con el administrador
                    </span>
                </div>
            </form>

            <div class="mt-10 text-center">
                <p class="text-sm text-gray-400">© 2025 Sistema C.S. La Unión</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import {
    IdentificationIcon,
    LockClosedIcon,
    ExclamationCircleIcon,
    ArrowPathIcon,
    BuildingOfficeIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "../../store/auth";

const emit = defineEmits<{
    (e: "success"): void;
}>();

const error = ref("");
const isLoading = ref(false);
const showPassword = ref(false);
const auth = useAuthStore();

// Validation Schema
const schema = yup.object({
    dni: yup
        .string()
        .required("El DNI es obligatorio")
        .matches(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos"),
    password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const { handleSubmit, errors, defineField, setFieldValue } = useForm({
    validationSchema: schema,
});

const [dni, dniAttrs] = defineField("dni");
const [password, passwordAttrs] = defineField("password");

// Ensure only numbers in DNI input
const onDniInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, "");
    setFieldValue("dni", value);
};

const onSubmit = handleSubmit(async (values) => {
    error.value = "";
    isLoading.value = true;

    try {
        await auth.login(values.dni, values.password);
        emit("success");
    } catch (e: any) {
        if (e.response?.status === 401) {
            error.value = "Credenciales incorrectas. Verifique DNI y contraseña.";
        } else if (e.response?.status === 403) {
            error.value = "Cuenta inactiva o sin permisos. Contacte a soporte.";
        } else {
            error.value =
                e?.response?.data?.msg ||
                e?.response?.data?.error ||
                "Error al iniciar sesión. Inténtelo más tarde.";
        }

        // Clear error after timeout
        setTimeout(() => {
            error.value = "";
        }, 5000);
    } finally {
        isLoading.value = false;
    }
});
</script>
