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
                        <div>
                            <h3 class="text-xl font-bold">{{ esEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
                            <p class="text-teal-100 text-sm mt-1">{{ esEdicion ? 'Actualiza los datos del usuario' :
                                'Registra un nuevo usuario en el sistema' }}</p>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Contenido del modal -->
                <div class="p-6 overflow-y-auto flex-1">
                    <form @submit="onSubmit" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo <span class="text-red-500">*</span>
                                </label>
                                <input v-model="name" v-bind="nameAttrs" type="text"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase"
                                    :class="{ 'border-red-500': errors.name }" placeholder="JUAN PÉREZ"
                                    @input="name = ($event.target as HTMLInputElement).value.toUpperCase()" />
                                <span v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</span>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Usuario (DNI) <span class="text-red-500">*</span>
                                </label>
                                <input v-model="username" v-bind="usernameAttrs" type="text" maxlength="8"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    :class="{ 'border-red-500': errors.username }" placeholder="12345678" />
                                <span v-if="errors.username" class="text-red-500 text-xs mt-1">{{ errors.username
                                }}</span>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña <span v-if="!esEdicion" class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input v-model="password" v-bind="passwordAttrs"
                                        :type="showPassword ? 'text' : 'password'"
                                        class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        :class="{ 'border-red-500': errors.password }"
                                        :placeholder="esEdicion ? 'Dejar vacío para mantener' : '********'" />
                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                        <EyeSlashIcon v-if="showPassword" class="w-5 h-5" />
                                        <EyeIcon v-else class="w-5 h-5" />
                                    </button>
                                </div>
                                <span v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password
                                }}</span>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Rol <span class="text-red-500">*</span>
                                </label>
                                <select v-model="role" v-bind="roleAttrs"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                    :class="{ 'border-red-500': errors.role }">
                                    <option value="">Seleccionar rol</option>
                                    <option value="admin">Administrador</option>
                                    <option value="profesional">Profesional</option>
                                    <option value="asistente">Asistente Técnico</option>
                                </select>
                                <span v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</span>
                            </div>
                        </div>

                        <!-- Mensaje de error -->
                        <transition enter-active-class="transition ease-out duration-200"
                            enter-from-class="opacity-0 transform -translate-y-1"
                            enter-to-class="opacity-100 transform translate-y-0">
                            <div v-if="error"
                                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                <ExclamationCircleIcon class="w-5 h-5" />
                                <span class="text-sm">{{ error }}</span>
                            </div>
                        </transition>

                        <div class="flex gap-3 pt-4">
                            <button type="submit" :disabled="loading"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <ArrowPathIcon v-if="loading" class="w-5 h-5 animate-spin" />
                                <CheckIcon v-else class="w-5 h-5" />
                                {{ loading ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Crear Usuario') }}
                            </button>
                            <button type="button" @click="cerrar"
                                class="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import {
    XMarkIcon,
    CheckIcon,
    ArrowPathIcon,
    ExclamationCircleIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/vue/24/outline'

const showPassword = ref(false)

interface UserFormData {
    id: number
    name: string
    username: string
    password: string
    role: 'admin' | 'profesional' | 'asistente' | ''
}

interface Props {
    visible: boolean
    esEdicion: boolean
    userData: UserFormData | null
    loading?: boolean
    error?: string
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    error: ''
})

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', data: UserFormData): void
}>()

// Esquema de validación con yup
const schema = computed(() => yup.object({
    name: yup.string()
        .required('El nombre completo es obligatorio')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/, 'El nombre debe estar en mayúsculas'),
    username: yup.string()
        .required('El usuario (DNI) es obligatorio')
        .matches(/^\d{8}$/, 'El DNI debe contener exactamente 8 dígitos numéricos'),
    password: props.esEdicion
        ? yup.string().nullable()
        : yup.string()
            .required('La contraseña es obligatoria')
            .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: yup.string()
        .required('Debe seleccionar un rol')
        .oneOf(['admin', 'profesional', 'asistente'], 'Seleccione un rol válido')
}))

const { handleSubmit, resetForm, errors, defineField } = useForm({
    validationSchema: schema,
    initialValues: {
        name: '',
        username: '',
        password: '',
        role: ''
    },
    validateOnMount: false
})

// Configuración para validar solo cuando el campo pierde el foco
const fieldConfig = {
    validateOnModelUpdate: false,
    validateOnBlur: true
}

const [name, nameAttrs] = defineField('name', fieldConfig)
const [username, usernameAttrs] = defineField('username', fieldConfig)
const [password, passwordAttrs] = defineField('password', fieldConfig)
const [role, roleAttrs] = defineField('role', fieldConfig)

watch(() => props.visible, (newVal) => {
    if (newVal && props.userData) {
        // Modo edición: cargar datos del usuario
        resetForm({
            values: {
                name: props.userData.name,
                username: props.userData.username,
                password: '',
                role: props.userData.role
            }
        })
    } else if (newVal && !props.esEdicion) {
        // Modo nuevo: limpiar formulario y errores
        resetForm({
            values: {
                name: '',
                username: '',
                password: '',
                role: ''
            }
        })
    }
    // Resetear estado de mostrar contraseña
    showPassword.value = false
})

const cerrar = () => {
    emit('close')
    resetForm({
        values: {
            name: '',
            username: '',
            password: '',
            role: ''
        }
    })
    showPassword.value = false
}

const onSubmit = handleSubmit((values) => {
    const formData: UserFormData = {
        id: props.userData?.id || 0,
        name: values.name,
        username: values.username,
        password: values.password || '',
        role: values.role as 'admin' | 'profesional' | 'asistente' | ''
    }
    emit('save', formData)
})
</script>
