<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="close">
            <div
                class="bg-white rounded-2xl max-w-3xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <PencilSquareIcon v-if="isEditMode" class="w-5 h-5 text-white" />
                                <UserPlusIcon v-else class="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">{{ modalTitle }}</h3>
                                <p class="text-teal-100 text-sm mt-0.5">{{ modalSubtitle }}</p>
                            </div>
                        </div>
                        <button @click="close"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Info del paciente (solo en modo edición) -->
                <div v-if="isEditMode && paciente" class="p-4 border-b bg-gray-50 flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <IdentificationIcon class="w-4 h-4 text-gray-500" />
                        <span class="text-sm text-gray-600">DNI: <span class="font-semibold">{{ paciente.dni
                                }}</span></span>
                    </div>
                    <span v-if="paciente.seguro"
                        :class="['px-3 py-1 text-sm font-medium rounded-full', paciente.seguro === 'SIS' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                        {{ paciente.seguro }}
                    </span>
                </div>

                <!-- Formulario -->
                <form @submit.prevent="onSubmit" class="flex-1 overflow-y-auto p-6">
                    <div class="space-y-6">
                        <!-- Sección: Datos Personales -->
                        <div>
                            <h4 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <UserIcon class="w-4 h-4 text-emerald-600" />
                                Datos Personales
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <!-- DNI -->
                                <div>
                                    <div class="flex items-center justify-between mb-1">
                                        <label class="block text-xs font-medium text-gray-600">DNI <span
                                                class="text-red-500">*</span></label>
                                        <!-- Toggle switch para habilitar edición del DNI en modo edición -->
                                        <label v-if="isEditMode" class="inline-flex items-center cursor-pointer">
                                            <input type="checkbox" v-model="editarDniHabilitado"
                                                @change="onToggleEditarDni" class="sr-only peer">
                                            <div
                                                class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500">
                                            </div>
                                            <span class="ms-2 text-xs font-medium"
                                                :class="editarDniHabilitado ? 'text-teal-600' : 'text-gray-500'">
                                                Editar DNI
                                            </span>
                                        </label>
                                    </div>
                                    <div class="relative">
                                        <input type="text" id="dni" v-model="dni" v-bind="dniAttrs" maxlength="8"
                                            placeholder="12345678" @input="onDniInput" @blur="verificarDniExistente"
                                            :disabled="isEditMode && !editarDniHabilitado"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm pr-10"
                                            :class="{
                                                'border-red-500 bg-red-50': errors.dni,
                                                'bg-gray-50 text-gray-600': isEditMode && !editarDniHabilitado,
                                                'border-amber-500': dniExiste && (!isEditMode || editarDniHabilitado),
                                                'border-teal-400 ring-1 ring-teal-200': isEditMode && editarDniHabilitado && !errors.dni && !dniExiste
                                            }" />
                                        <!-- Indicador de verificación -->
                                        <div v-if="verificandoDni"
                                            class="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ArrowPathIcon class="w-4 h-4 animate-spin text-gray-400" />
                                        </div>
                                        <div v-else-if="dniExiste && (!isEditMode || editarDniHabilitado)"
                                            class="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ExclamationTriangleIcon class="w-4 h-4 text-amber-500" />
                                        </div>
                                    </div>
                                    <span v-if="errors.dni" class="text-red-500 text-xs mt-1 block">{{ errors.dni
                                        }}</span>
                                    <!-- Aviso de edición de DNI -->
                                    <div v-if="isEditMode && editarDniHabilitado && !dniExiste"
                                        class="mt-2 p-2 bg-teal-50 border border-teal-200 rounded-lg">
                                        <div class="flex items-center gap-2 text-xs text-teal-700">
                                            <InformationCircleIcon class="w-4 h-4 flex-shrink-0" />
                                            <span>Puede modificar el DNI del paciente. Asegúrese de que sea
                                                correcto.</span>
                                        </div>
                                    </div>
                                    <!-- Advertencia de DNI existente -->
                                    <div v-if="dniExiste && (!isEditMode || editarDniHabilitado) && pacienteExistente"
                                        class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div class="flex items-start gap-2">
                                            <ExclamationTriangleIcon
                                                class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                            <div class="text-sm">
                                                <p class="font-medium text-amber-800">¡Este DNI ya está registrado!</p>
                                                <p class="text-amber-700 mt-1">
                                                    {{ pacienteExistente.nombres }} {{
                                                        pacienteExistente.apellido_paterno ||
                                                    pacienteExistente.apellidoPaterno }}
                                                </p>
                                                <p v-if="!isEditMode" class="text-amber-600 text-xs mt-1">Si desea
                                                    modificar sus datos, búsquelo en el listado y edítelo.</p>
                                                <p v-else class="text-amber-600 text-xs mt-1">No puede usar un DNI que
                                                    ya pertenece a otro paciente.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Nombres -->
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Nombres <span
                                            class="text-red-500">*</span></label>
                                    <input type="text" id="nombres" v-model="nombres" v-bind="nombresAttrs"
                                        @input="toUpperCaseNombres"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        :class="{ 'border-red-500 bg-red-50': errors.nombres }">
                                    <span v-if="errors.nombres" class="text-red-500 text-xs mt-1">{{ errors.nombres
                                        }}</span>
                                </div>

                                <!-- Apellido Paterno -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Apellido Paterno <span
                                            class="text-red-500">*</span></label>
                                    <input type="text" id="apellido_paterno" v-model="apellido_paterno"
                                        v-bind="apellidoPaternoAttrs" @input="toUpperCaseApellidoPaterno"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        :class="{ 'border-red-500 bg-red-50': errors.apellido_paterno }">
                                    <span v-if="errors.apellido_paterno" class="text-red-500 text-xs mt-1">{{
                                        errors.apellido_paterno }}</span>
                                </div>

                                <!-- Apellido Materno -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Apellido Materno <span
                                            class="text-red-500">*</span></label>
                                    <input type="text" id="apellido_materno" v-model="apellido_materno"
                                        v-bind="apellidoMaternoAttrs" @input="toUpperCaseApellidoMaterno"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        :class="{ 'border-red-500 bg-red-50': errors.apellido_materno }">
                                    <span v-if="errors.apellido_materno" class="text-red-500 text-xs mt-1">{{
                                        errors.apellido_materno }}</span>
                                </div>

                                <!-- Fecha de Nacimiento -->
                                <div>
                                    <HsDatePicker v-model="fecha_nacimiento" label="Fecha Nacimiento" :required="true"
                                        :error="errors.fecha_nacimiento" :max-date="todayDate" min-date="1900-01-01"
                                        format="dd/mm/yyyy" placeholder="Seleccionar fecha"
                                        input-id="fecha_nacimiento" />
                                </div>

                                <!-- Sexo -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Sexo <span
                                            class="text-red-500">*</span></label>
                                    <select id="sexo" v-model="sexo" v-bind="sexoAttrs"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                                        :class="{ 'border-red-500 bg-red-50': errors.sexo }">
                                        <option value="">Seleccione</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                    <span v-if="errors.sexo" class="text-red-500 text-xs mt-1">{{ errors.sexo }}</span>
                                </div>

                                <!-- Estado Civil -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Estado Civil <span
                                            class="text-red-500">*</span></label>
                                    <select id="estado_civil" v-model="estado_civil" v-bind="estadoCivilAttrs"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                                        :class="{ 'border-red-500 bg-red-50': errors.estado_civil }">
                                        <option value="">Seleccione</option>
                                        <option value="S">Soltero(a)</option>
                                        <option value="C">Casado(a)</option>
                                        <option value="V">Viudo(a)</option>
                                        <option value="D">Divorciado(a)</option>
                                    </select>
                                    <span v-if="errors.estado_civil" class="text-red-500 text-xs mt-1">{{
                                        errors.estado_civil }}</span>
                                </div>

                                <!-- Teléfono -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Teléfono / Celular <span
                                            class="text-red-500">*</span></label>
                                    <input type="tel" id="telefono" v-model="telefono" v-bind="telefonoAttrs"
                                        maxlength="9" placeholder="999999999"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        :class="{ 'border-red-500 bg-red-50': errors.telefono }">
                                    <span v-if="errors.telefono" class="text-red-500 text-xs mt-1">{{ errors.telefono
                                        }}</span>
                                </div>

                                <!-- Email -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                    <input type="email" id="email" v-model="email" v-bind="emailAttrs"
                                        placeholder="correo@ejemplo.com"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        :class="{ 'border-red-500 bg-red-50': errors.email }">
                                    <span v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email
                                        }}</span>
                                </div>

                                <!-- Dirección -->
                                <div class="md:col-span-3">
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Dirección <span
                                            class="text-red-500">*</span></label>
                                    <input type="text" id="direccion" v-model="direccion" v-bind="direccionAttrs"
                                        placeholder="Dirección completa"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        :class="{ 'border-red-500 bg-red-50': errors.direccion }">
                                    <span v-if="errors.direccion" class="text-red-500 text-xs mt-1">{{ errors.direccion
                                        }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Datos Adicionales -->
                        <div>
                            <h4 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <InformationCircleIcon class="w-4 h-4 text-purple-600" />
                                Datos Adicionales
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <!-- Grado Instrucción -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Grado Instrucción <span
                                            class="text-red-500">*</span></label>
                                    <select id="grado_instruccion" v-model="grado_instruccion"
                                        v-bind="gradoInstruccionAttrs"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                                        :class="{ 'border-red-500 bg-red-50': errors.grado_instruccion }">
                                        <option value="">Seleccione</option>
                                        <option value="primaria_incompleta">Primaria Incompleta</option>
                                        <option value="primaria_completa">Primaria Completa</option>
                                        <option value="secundaria_incompleta">Secundaria Incompleta</option>
                                        <option value="secundaria_completa">Secundaria Completa</option>
                                        <option value="tecnico_superior_completa">Técnico Superior</option>
                                        <option value="universitario_completo">Universitario</option>
                                    </select>
                                    <span v-if="errors.grado_instruccion" class="text-red-500 text-xs mt-1">{{
                                        errors.grado_instruccion }}</span>
                                </div>

                                <!-- Ocupación -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Ocupación <span
                                            class="text-red-500">*</span></label>
                                    <input type="text" id="ocupacion" v-model="ocupacion" v-bind="ocupacionAttrs"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        :class="{ 'border-red-500 bg-red-50': errors.ocupacion }">
                                    <span v-if="errors.ocupacion" class="text-red-500 text-xs mt-1">{{ errors.ocupacion
                                        }}</span>
                                </div>

                                <!-- Religión -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Religión <span
                                            class="text-red-500">*</span></label>
                                    <input type="text" id="religion" v-model="religion" v-bind="religionAttrs"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        :class="{ 'border-red-500 bg-red-50': errors.religion }">
                                    <span v-if="errors.religion" class="text-red-500 text-xs mt-1">{{ errors.religion
                                        }}</span>
                                </div>

                                <!-- Procedencia -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Procedencia <span
                                            class="text-red-500">*</span></label>
                                    <input type="text" id="procedencia" v-model="procedencia" v-bind="procedenciaAttrs"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        :class="{ 'border-red-500 bg-red-50': errors.procedencia }">
                                    <span v-if="errors.procedencia" class="text-red-500 text-xs mt-1">{{
                                        errors.procedencia }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Seguro -->
                        <div>
                            <h4 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <IdentificationIcon class="w-4 h-4 text-blue-600" />
                                Afiliación a Seguro
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Tipo Seguro -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Tipo de Seguro <span
                                            class="text-red-500">*</span></label>
                                    <select id="seguro" v-model="seguro" v-bind="seguroAttrs"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                                        :class="{ 'border-red-500 bg-red-50': errors.seguro }">
                                        <option value="">Seleccione</option>
                                        <option value="SIS">SIS</option>
                                        <option value="ESSALUD">ESSALUD</option>
                                    </select>
                                    <span v-if="errors.seguro" class="text-red-500 text-xs mt-1">{{ errors.seguro
                                        }}</span>
                                </div>

                                <!-- Número de Seguro -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Número de Afiliación
                                        <span class="text-red-500">*</span></label>
                                    <input type="text" id="numero_seguro" v-model="numero_seguro"
                                        v-bind="numeroSeguroAttrs" placeholder="000-000-000000"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        :class="{ 'border-red-500 bg-red-50': errors.numero_seguro }">
                                    <span v-if="errors.numero_seguro" class="text-red-500 text-xs mt-1">{{
                                        errors.numero_seguro }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer del modal -->
                    <div class="mt-6 pt-4 border-t flex justify-between items-center">
                        <p class="text-sm text-gray-500 flex items-center gap-1">
                            <span class="text-red-500">*</span> Campos obligatorios
                        </p>
                        <div class="flex items-center gap-3">
                            <button type="button" @click="close"
                                class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                                Cancelar
                            </button>
                            <button type="submit" :disabled="guardando || dniExiste"
                                class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center gap-2">
                                <ArrowPathIcon v-if="guardando" class="w-4 h-4 animate-spin" />
                                <template v-else>
                                    <PencilSquareIcon v-if="isEditMode" class="w-4 h-4" />
                                    <UserPlusIcon v-else class="w-4 h-4" />
                                </template>
                                <span v-if="guardando">{{ isEditMode ? 'Guardando...' : 'Registrando...' }}</span>
                                <span v-else>{{ isEditMode ? 'Guardar Cambios' : 'Registrar Paciente' }}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import pacienteService, { type RegistrarPacientePayload, type Paciente } from '../../services/pacienteService';
import {
    XMarkIcon,
    ArrowPathIcon,
    UserPlusIcon,
    UserIcon,
    IdentificationIcon,
    InformationCircleIcon,
    PencilSquareIcon,
    ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';
import HsDatePicker from '../common/HsDatePicker.vue';

interface Props {
    show: boolean;
    paciente?: Paciente | null;
}

const props = withDefaults(defineProps<Props>(), {
    paciente: null
});

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'saved'): void;
}>();

// Computed para modo de edición
const isEditMode = computed(() => !!props.paciente);

// Computed para título y subtítulo del modal
const modalTitle = computed(() => isEditMode.value ? 'Editar Paciente' : 'Registrar Nuevo Paciente');
const modalSubtitle = computed(() => {
    if (isEditMode.value && props.paciente) {
        const apellido = props.paciente.apellido_paterno || props.paciente.apellidoPaterno || '';
        return `${props.paciente.nombres} ${apellido}`;
    }
    return 'Complete los datos del paciente';
});

// Estado
const guardando = ref(false);
const verificandoDni = ref(false);
const dniExiste = ref(false);
const pacienteExistente = ref<Paciente | null>(null);
const editarDniHabilitado = ref(false);
const todayDate = new Date().toISOString().split('T')[0];

// Esquema de validación con yup
const schema = yup.object({
    dni: yup.string()
        .required('El DNI es obligatorio')
        .length(8, 'El DNI debe tener 8 dígitos')
        .matches(/^[0-9]+$/, 'El DNI solo debe contener números'),
    nombres: yup.string().required('Los nombres son obligatorios'),
    apellido_paterno: yup.string().required('El apellido paterno es obligatorio'),
    apellido_materno: yup.string().required('El apellido materno es obligatorio'),
    fecha_nacimiento: yup.string().required('La fecha de nacimiento es obligatoria'),
    sexo: yup.string().required('El sexo es obligatorio'),
    estado_civil: yup.string().required('El estado civil es obligatorio'),
    telefono: yup.string()
        .required('El teléfono es obligatorio')
        .matches(/^[0-9]+$/, 'Solo números')
        .min(9, 'El teléfono debe tener 9 dígitos'),
    email: yup.string().email('El email no es válido').nullable(),
    direccion: yup.string().required('La dirección es obligatoria'),
    grado_instruccion: yup.string().required('El grado de instrucción es obligatorio'),
    ocupacion: yup.string().required('La ocupación es obligatoria'),
    religion: yup.string().required('La religión es obligatoria'),
    procedencia: yup.string().required('La procedencia es obligatoria'),
    seguro: yup.string().required('El tipo de seguro es obligatorio'),
    numero_seguro: yup.string().required('El número de afiliación es obligatorio')
});

// Configuración de vee-validate
const { handleSubmit, resetForm, errors, defineField, setFieldValue, setValues } = useForm({
    validationSchema: schema,
    initialValues: {
        dni: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        sexo: '',
        estado_civil: '',
        telefono: '',
        email: '',
        direccion: '',
        grado_instruccion: '',
        ocupacion: '',
        religion: '',
        procedencia: '',
        seguro: '',
        numero_seguro: ''
    }
});

// Definir campos con vee-validate
const [dni, dniAttrs] = defineField('dni');
const [nombres, nombresAttrs] = defineField('nombres');
const [apellido_paterno, apellidoPaternoAttrs] = defineField('apellido_paterno');
const [apellido_materno, apellidoMaternoAttrs] = defineField('apellido_materno');
const [fecha_nacimiento] = defineField('fecha_nacimiento');
const [sexo, sexoAttrs] = defineField('sexo');
const [estado_civil, estadoCivilAttrs] = defineField('estado_civil');
const [telefono, telefonoAttrs] = defineField('telefono');
const [email, emailAttrs] = defineField('email');
const [direccion, direccionAttrs] = defineField('direccion');
const [grado_instruccion, gradoInstruccionAttrs] = defineField('grado_instruccion');
const [ocupacion, ocupacionAttrs] = defineField('ocupacion');
const [religion, religionAttrs] = defineField('religion');
const [procedencia, procedenciaAttrs] = defineField('procedencia');
const [seguro, seguroAttrs] = defineField('seguro');
const [numero_seguro, numeroSeguroAttrs] = defineField('numero_seguro');

// Métodos auxiliares
const toUpperCaseNombres = () => {
    if (nombres.value) {
        setFieldValue('nombres', nombres.value.toUpperCase());
    }
};

const toUpperCaseApellidoPaterno = () => {
    if (apellido_paterno.value) {
        setFieldValue('apellido_paterno', apellido_paterno.value.toUpperCase());
    }
};

const toUpperCaseApellidoMaterno = () => {
    if (apellido_materno.value) {
        setFieldValue('apellido_materno', apellido_materno.value.toUpperCase());
    }
};

// Handler del toggle para edición del DNI
const onToggleEditarDni = () => {
    // Limpiar estado de verificación al cambiar
    if (editarDniHabilitado.value) {
        dniExiste.value = false;
        pacienteExistente.value = null;
    }
};

const onlyNumbers = () => {
    if (dni.value) {
        setFieldValue('dni', dni.value.replace(/[^0-9]/g, ''));
    }
};

// Manejador de input de DNI
const onDniInput = () => {
    onlyNumbers();
    // Reset del estado de verificación al cambiar el DNI
    if (dniExiste.value) {
        dniExiste.value = false;
        pacienteExistente.value = null;
    }
};

// Verificar si el DNI ya existe (solo en modo registro)
const verificarDniExistente = async () => {
    if (isEditMode.value || !dni.value || dni.value.length !== 8) {
        dniExiste.value = false;
        pacienteExistente.value = null;
        return;
    }

    verificandoDni.value = true;
    try {
        const { data } = await pacienteService.buscarPorDNI(dni.value);
        if (data) {
            dniExiste.value = true;
            pacienteExistente.value = data;
        } else {
            dniExiste.value = false;
            pacienteExistente.value = null;
        }
    } catch (error: any) {
        // Si es 404, el paciente no existe (está bien)
        if (error.response?.status === 404) {
            dniExiste.value = false;
            pacienteExistente.value = null;
        }
    } finally {
        verificandoDni.value = false;
    }
};

// Cargar datos del paciente en modo edición
const loadPacienteData = () => {
    if (props.paciente) {
        setValues({
            dni: props.paciente.dni || '',
            nombres: props.paciente.nombres || '',
            apellido_paterno: props.paciente.apellido_paterno || props.paciente.apellidoPaterno || '',
            apellido_materno: props.paciente.apellido_materno || props.paciente.apellidoMaterno || '',
            fecha_nacimiento: props.paciente.fecha_nacimiento || props.paciente.fechaNacimiento || '',
            sexo: props.paciente.sexo || '',
            estado_civil: props.paciente.estado_civil || '',
            telefono: props.paciente.telefono || '',
            email: props.paciente.email || '',
            direccion: props.paciente.direccion || '',
            grado_instruccion: props.paciente.grado_instruccion || '',
            ocupacion: props.paciente.ocupacion || '',
            religion: props.paciente.religion || '',
            procedencia: props.paciente.procedencia || '',
            seguro: props.paciente.seguro || '',
            numero_seguro: props.paciente.numero_seguro || props.paciente.numero_afiliacion || ''
        });
    }
};

// Submit handler con vee-validate
const onSubmit = handleSubmit(async (values) => {
    guardando.value = true;

    try {
        if (isEditMode.value && props.paciente) {
            // Modo edición
            const payload: Record<string, any> = {
                nombres: values.nombres,
                apellido_paterno: values.apellido_paterno,
                apellido_materno: values.apellido_materno,
                fecha_nacimiento: values.fecha_nacimiento,
                sexo: values.sexo,
                estado_civil: values.estado_civil,
                direccion: values.direccion,
                grado_instruccion: values.grado_instruccion,
                religion: values.religion,
                procedencia: values.procedencia,
                telefono: values.telefono,
                email: values.email || undefined,
                seguro: values.seguro,
                numero_seguro: values.numero_seguro,
                ocupacion: values.ocupacion
            };

            // Incluir DNI solo si se habilitó la edición y cambió
            if (editarDniHabilitado.value && values.dni !== props.paciente.dni) {
                payload.dni = values.dni;
            }

            await pacienteService.updatePaciente(props.paciente.id, payload);
        } else {
            // Modo registro
            const payload: RegistrarPacientePayload = {
                dni: values.dni,
                nombres: values.nombres,
                apellido_paterno: values.apellido_paterno,
                apellido_materno: values.apellido_materno,
                fecha_nacimiento: values.fecha_nacimiento,
                sexo: values.sexo,
                estado_civil: values.estado_civil,
                direccion: values.direccion,
                grado_instruccion: values.grado_instruccion,
                religion: values.religion,
                procedencia: values.procedencia,
                telefono: values.telefono,
                email: values.email || undefined,
                seguro: values.seguro,
                numero_seguro: values.numero_seguro,
                ocupacion: values.ocupacion
            };

            await pacienteService.crearPaciente(payload);
        }

        emit('saved');
        close();
    } catch (error: any) {
        console.error("Error al guardar paciente:", error);
        alert(error.response?.data?.error || 'Error al guardar paciente');
    } finally {
        guardando.value = false;
    }
});

const close = () => {
    // Limpiar estado de verificación de DNI y edición
    dniExiste.value = false;
    pacienteExistente.value = null;
    verificandoDni.value = false;
    editarDniHabilitado.value = false;
    emit('close');
};

// Watch para cargar/resetear el formulario cuando se abre el modal
watch(() => props.show, (newVal) => {
    if (newVal) {
        // Limpiar estado de verificación DNI y edición
        dniExiste.value = false;
        pacienteExistente.value = null;
        verificandoDni.value = false;
        editarDniHabilitado.value = false;

        if (props.paciente) {
            loadPacienteData();
        } else {
            resetForm();
        }
    }
});
</script>

<style scoped>
/* Scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
