<template>
    <div class="max-w-4xl mx-auto">
        <form @submit.prevent="onSubmit" class="space-y-4">

            <!-- Sección 1: Búsqueda por DNI -->
            <div id="registro-paciente-top" class="bg-white rounded-xl shadow-md p-5">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MagnifyingGlassIcon class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 class="font-bold text-gray-800">Buscar Paciente</h2>
                        <p class="text-xs text-gray-500">Ingrese el DNI para buscar datos existentes</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <input type="text" id="dni" v-model="dni" v-bind="dniAttrs" placeholder="Ingrese DNI (8 dígitos)"
                        maxlength="8" @keyup.enter="buscarPorDNI"
                        class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        :class="{ 'border-red-500': errors.dni, 'border-green-500': !errors.dni && dni }" />
                    <button type="button" @click="buscarPorDNI" :disabled="!dni || dni.length !== 8 || isSearching"
                        class="px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2" :class="dni && dni.length === 8 && !isSearching
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'">
                        <ArrowPathIcon class="w-5 h-5 animate-spin" v-if="isSearching" />
                        <MagnifyingGlassIcon class="w-5 h-5" v-else />
                        {{ isSearching ? "Buscando..." : "Buscar" }}
                    </button>
                </div>
                <span v-if="errors.dni" class="text-red-500 text-xs mt-1 block">{{ errors.dni }}</span>

                <transition enter-active-class="transition ease-out duration-200">
                    <div v-if="searchMessage.text" :class="[
                        'mt-3 px-3 py-2 rounded-lg text-sm flex items-center gap-2',
                        searchMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    ]">
                        <CheckCircleIcon v-if="searchMessage.type === 'success'" class="w-5 h-5" />
                        <ExclamationCircleIcon v-else class="w-5 h-5" />
                        {{ searchMessage.text }}
                    </div>
                </transition>
            </div>

            <!-- Sección 2: Datos del Paciente (Colapsable) -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <button type="button" @click="seccionesAbiertas.datosPersonales = !seccionesAbiertas.datosPersonales"
                    class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <UserIcon class="w-5 h-5 text-emerald-600" />
                        </div>
                        <div class="text-left">
                            <h2 class="font-bold text-gray-800">Datos Personales</h2>
                            <p class="text-xs text-gray-500">Información básica del paciente</p>
                        </div>
                    </div>
                    <ChevronUpIcon v-if="seccionesAbiertas.datosPersonales" class="w-5 h-5 transition-transform" />
                    <ChevronDownIcon v-else class="w-5 h-5 transition-transform" />
                </button>

                <transition enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[2000px] opacity-100"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="max-h-[2000px] opacity-100" leave-to-class="max-h-0 opacity-0">
                    <div v-show="seccionesAbiertas.datosPersonales" class="px-5 pb-5 border-t">
                        <div class="flex justify-end p-4">
                            <div
                                class="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                                <span class="mr-1">( * )</span> Campos obligatorios
                            </div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                            <!-- Nombres -->
                            <div class="col-span-2">
                                <label class="block text-xs font-medium text-gray-600 mb-1">Nombres <span
                                        class="text-red-500">*</span></label>
                                <input type="text" id="nombres" v-model="nombres" v-bind="nombresAttrs"
                                    placeholder="Nombres" @input="toUpperCase('nombres')"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                    :class="{ 'border-red-500 bg-red-50': errors.nombres, 'border-gray-300': !errors.nombres }" />
                                <span v-if="errors.nombres" class="text-red-500 text-xs mt-1">{{ errors.nombres
                                }}</span>
                            </div>
                            <!-- Apellido Paterno -->
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Ap. Paterno <span
                                        class="text-red-500">*</span></label>
                                <input type="text" id="apellidoPaterno" v-model="apellidoPaterno"
                                    v-bind="apellidoPaternoAttrs" @input="toUpperCase('apellidoPaterno')"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                    :class="{ 'border-red-500 bg-red-50': errors.apellidoPaterno, 'border-gray-300': !errors.apellidoPaterno }" />
                                <span v-if="errors.apellidoPaterno" class="text-red-500 text-xs mt-1">{{
                                    errors.apellidoPaterno }}</span>
                            </div>
                            <!-- Apellido Materno -->
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Ap. Materno <span
                                        class="text-red-500">*</span></label>
                                <input type="text" id="apellidoMaterno" v-model="apellidoMaterno"
                                    v-bind="apellidoMaternoAttrs" @input="toUpperCase('apellidoMaterno')"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                    :class="{ 'border-red-500 bg-red-50': errors.apellidoMaterno, 'border-gray-300': !errors.apellidoMaterno }" />
                                <span v-if="errors.apellidoMaterno" class="text-red-500 text-xs mt-1">{{
                                    errors.apellidoMaterno }}</span>
                            </div>
                            <!-- Fecha Nacimiento -->
                            <div>
                                <HsDatePicker v-model="fechaNacimiento" label="F. Nacimiento" :required="true"
                                    :error="errors.fechaNacimiento" :max-date="todayDate" min-date="1900-01-01"
                                    format="dd/mm/yyyy" placeholder="Seleccionar fecha" input-id="fechaNacimiento" />
                            </div>
                            <!-- Edad -->
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Edad</label>
                                <input type="text" disabled :value="calculatedEdad"
                                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" />
                            </div>
                            <!-- Sexo -->
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Sexo <span
                                        class="text-red-500">*</span></label>
                                <select id="sexo" v-model="sexo" v-bind="sexoAttrs"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                                    :class="{ 'border-red-500 bg-red-50': errors.sexo, 'border-gray-300': !errors.sexo }">
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
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                                    :class="{ 'border-red-500 bg-red-50': errors.estado_civil, 'border-gray-300': !errors.estado_civil }">
                                    <option value="">Seleccione</option>
                                    <option value="S">Soltero</option>
                                    <option value="C">Casado</option>
                                    <option value="V">Viudo</option>
                                    <option value="D">Divorciado</option>
                                </select>
                                <span v-if="errors.estado_civil" class="text-red-500 text-xs mt-1">{{
                                    errors.estado_civil }}</span>
                            </div>
                            <!-- Teléfono -->
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Teléfono / Celular <span
                                        class="text-red-500">*</span></label>
                                <input type="tel" id="telefono" v-model="telefono" v-bind="telefonoAttrs"
                                    placeholder="999999999" maxlength="9"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                    :class="{ 'border-red-500 bg-red-50': errors.telefono, 'border-gray-300': !errors.telefono }" />
                                <span v-if="errors.telefono" class="text-red-500 text-xs mt-1">{{ errors.telefono
                                }}</span>
                            </div>
                            <!-- Email -->
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                <input type="email" id="email" v-model="email" v-bind="emailAttrs"
                                    placeholder="correo@ejemplo.com"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                    :class="{ 'border-red-500 bg-red-50': errors.email, 'border-gray-300': !errors.email }" />
                                <span v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</span>
                            </div>
                            <!-- Dirección -->
                            <div class="col-span-2">
                                <label class="block text-xs font-medium text-gray-600 mb-1">Dirección <span
                                        class="text-red-500">*</span></label>
                                <input type="text" id="direccion" v-model="direccion" v-bind="direccionAttrs"
                                    placeholder="Dirección completa"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                    :class="{ 'border-red-500 bg-red-50': errors.direccion, 'border-gray-300': !errors.direccion }" />
                                <span v-if="errors.direccion" class="text-red-500 text-xs mt-1">{{ errors.direccion
                                }}</span>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Sección 3: Datos Adicionales (Obligatorio) -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden"
                :class="{ 'ring-2 ring-red-500': errors.gradoInstruccion || errors.ocupacion || errors.religion || errors.procedencia }">
                <button type="button" @click="seccionesAbiertas.datosAdicionales = !seccionesAbiertas.datosAdicionales"
                    class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                            :class="errors.gradoInstruccion || errors.ocupacion || errors.religion || errors.procedencia ? 'bg-red-100' : 'bg-purple-100'">
                            <InformationCircleIcon class="w-5 h-5"
                                :class="errors.gradoInstruccion || errors.ocupacion || errors.religion || errors.procedencia ? 'text-red-600' : 'text-purple-600'" />
                        </div>
                        <div class="text-left">
                            <h2 class="font-bold text-gray-800">Datos Adicionales <span class="text-red-500">*</span>
                            </h2>
                            <p class="text-xs text-gray-500">Información complementaria del paciente</p>
                        </div>
                        <span
                            v-if="errors.gradoInstruccion || errors.ocupacion || errors.religion || errors.procedencia"
                            class="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                            Campos incompletos
                        </span>
                    </div>
                    <ChevronUpIcon v-if="seccionesAbiertas.datosAdicionales" class="w-5 h-5 transition-transform" />
                    <ChevronDownIcon v-else class="w-5 h-5 transition-transform" />
                </button>

                <transition enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[500px] opacity-100"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="max-h-[500px] opacity-100" leave-to-class="max-h-0 opacity-0">
                    <div v-show="seccionesAbiertas.datosAdicionales" class="px-5 pb-5 border-t">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Grado Instrucción <span
                                        class="text-red-500">*</span></label>
                                <select v-model="gradoInstruccion" v-bind="gradoInstruccionAttrs"
                                    class="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                                    :class="{ 'border-red-500 bg-red-50': errors.gradoInstruccion, 'border-gray-300': !errors.gradoInstruccion }">
                                    <option value="">Seleccione</option>
                                    <option value="primaria_incompleta">Primaria Incompleta</option>
                                    <option value="primaria_completa">Primaria Completa</option>
                                    <option value="secundaria_incompleta">Secundaria Incompleta</option>
                                    <option value="secundaria_completa">Secundaria Completa</option>
                                    <option value="tecnico_superior_completa">Técnico Superior</option>
                                    <option value="universitario_completo">Universitario</option>
                                </select>
                                <span v-if="errors.gradoInstruccion" class="text-red-500 text-xs mt-1">{{
                                    errors.gradoInstruccion }}</span>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Ocupación <span
                                        class="text-red-500">*</span></label>
                                <input type="text" id="ocupacion" v-model="ocupacion" v-bind="ocupacionAttrs"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                    :class="{ 'border-red-500 bg-red-50': errors.ocupacion, 'border-gray-300': !errors.ocupacion }" />
                                <span v-if="errors.ocupacion" class="text-red-500 text-xs mt-1">{{ errors.ocupacion
                                }}</span>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Religión <span
                                        class="text-red-500">*</span></label>
                                <input type="text" id="religion" v-model="religion" v-bind="religionAttrs"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                    :class="{ 'border-red-500 bg-red-50': errors.religion, 'border-gray-300': !errors.religion }" />
                                <span v-if="errors.religion" class="text-red-500 text-xs mt-1">{{ errors.religion
                                }}</span>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Procedencia <span
                                        class="text-red-500">*</span></label>
                                <input type="text" id="procedencia" v-model="procedencia" v-bind="procedenciaAttrs"
                                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                    :class="{ 'border-red-500 bg-red-50': errors.procedencia, 'border-gray-300': !errors.procedencia }" />
                                <span v-if="errors.procedencia" class="text-red-500 text-xs mt-1">{{ errors.procedencia
                                }}</span>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Sección 5: Afiliación (Obligatorio) -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden"
                :class="{ 'ring-2 ring-red-500': errors.numeroSis || errors.tipoSeguro }">
                <button type="button" @click="seccionesAbiertas.afiliacion = !seccionesAbiertas.afiliacion"
                    class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                            :class="errors.numeroSis || errors.tipoSeguro ? 'bg-red-100' : 'bg-blue-100'">
                            <IdentificationIcon class="w-5 h-5"
                                :class="errors.numeroSis || errors.tipoSeguro ? 'text-red-600' : 'text-blue-600'" />
                        </div>
                        <div class="text-left">
                            <h2 class="font-bold text-gray-800">Afiliación a Seguro <span class="text-red-500">*</span>
                            </h2>
                            <p class="text-xs text-gray-500">Datos de SIS o ESSALUD (obligatorio)</p>
                        </div>
                        <span v-if="errors.numeroSis || errors.tipoSeguro"
                            class="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                            Campos incompletos
                        </span>
                    </div>
                    <ChevronUpIcon v-if="seccionesAbiertas.afiliacion" class="w-5 h-5 transition-transform" />
                    <ChevronDownIcon v-else class="w-5 h-5 transition-transform" />
                </button>

                <transition enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[300px] opacity-100"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="max-h-[300px] opacity-100" leave-to-class="max-h-0 opacity-0">
                    <div v-show="seccionesAbiertas.afiliacion" class="px-5 pb-5 border-t">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Número Afiliación <span
                                        class="text-red-500">*</span></label>
                                <input type="text" id="numeroSis" v-model="numeroSis" v-bind="numeroSisAttrs"
                                    placeholder="000-000-000000" class="w-full px-3 py-2 border rounded-lg text-sm"
                                    :class="{ 'border-red-500 bg-red-50': errors.numeroSis, 'border-gray-300': !errors.numeroSis }" />
                                <span v-if="errors.numeroSis" class="text-red-500 text-xs mt-1">{{ errors.numeroSis
                                }}</span>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Tipo Seguro <span
                                        class="text-red-500">*</span></label>
                                <select id="tipoSeguro" v-model="tipoSeguro" v-bind="tipoSeguroAttrs"
                                    class="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                                    :class="{ 'border-red-500 bg-red-50': errors.tipoSeguro, 'border-gray-300': !errors.tipoSeguro }">
                                    <option value="">Seleccione</option>
                                    <option value="SIS">SIS</option>
                                    <option value="ESSALUD">ESSALUD</option>
                                </select>
                                <span v-if="errors.tipoSeguro" class="text-red-500 text-xs mt-1">{{ errors.tipoSeguro
                                }}</span>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Sección 4: Acompañante (Obligatorio) -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden"
                :class="{ 'ring-2 ring-red-500': errors.dniAcompanante || errors.nombreAcompanante || errors.telefonoAcompanante }">
                <button type="button" @click="seccionesAbiertas.acompanante = !seccionesAbiertas.acompanante"
                    class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                            :class="errors.dniAcompanante || errors.nombreAcompanante || errors.telefonoAcompanante ? 'bg-red-100' : 'bg-amber-100'">
                            <UsersIcon class="w-5 h-5"
                                :class="errors.dniAcompanante || errors.nombreAcompanante || errors.telefonoAcompanante ? 'text-red-600' : 'text-amber-600'" />
                        </div>
                        <div class="text-left">
                            <h2 class="font-bold text-gray-800">Acompañante <span class="text-red-500">*</span></h2>
                            <p class="text-xs text-gray-500">Datos del acompañante del paciente</p>
                        </div>
                        <span v-if="errors.dniAcompanante || errors.nombreAcompanante || errors.telefonoAcompanante"
                            class="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                            Campos incompletos
                        </span>
                    </div>
                    <ChevronUpIcon v-if="seccionesAbiertas.acompanante" class="w-5 h-5 transition-transform" />
                    <ChevronDownIcon v-else class="w-5 h-5 transition-transform" />
                </button>

                <transition enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[300px] opacity-100"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="max-h-[300px] opacity-100" leave-to-class="max-h-0 opacity-0">
                    <div v-show="seccionesAbiertas.acompanante" class="px-5 pb-5 border-t">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">DNI Acompañante <span
                                        class="text-red-500">*</span></label>
                                <div class="flex gap-1">
                                    <input type="text" id="dniAcompanante" v-model="dniAcompanante"
                                        v-bind="dniAcompananteAttrs" maxlength="8" placeholder="00000000"
                                        @keyup.enter="buscarDniAcompanante"
                                        class="flex-1 px-3 py-2 border rounded-lg text-sm transition focus:ring-2 focus:ring-amber-500"
                                        :class="{ 'border-red-500 bg-red-50': errors.dniAcompanante, 'border-gray-300': !errors.dniAcompanante }" />
                                    <button type="button" @click="buscarDniAcompanante"
                                        :disabled="!dniAcompanante || dniAcompanante.length !== 8 || isSearchingAcompanante"
                                        class="px-2 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 transition flex items-center justify-center">
                                        <ArrowPathIcon v-if="isSearchingAcompanante" class="w-4 h-4 animate-spin" />
                                        <MagnifyingGlassIcon v-else class="w-4 h-4" />
                                    </button>
                                </div>
                                <span v-if="errors.dniAcompanante" class="text-red-500 text-xs mt-1">{{
                                    errors.dniAcompanante }}</span>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Nombre Acompañante <span
                                        class="text-red-500">*</span></label>
                                <input type="text" id="nombreAcompanante" v-model="nombreAcompanante"
                                    v-bind="nombreAcompananteAttrs" placeholder="Nombre completo"
                                    class="w-full px-3 py-2 border rounded-lg text-sm"
                                    :class="{ 'border-red-500 bg-red-50': errors.nombreAcompanante, 'border-gray-300': !errors.nombreAcompanante }" />
                                <span v-if="errors.nombreAcompanante" class="text-red-500 text-xs mt-1">{{
                                    errors.nombreAcompanante }}</span>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-1">Teléfono Acompañante <span
                                        class="text-red-500">*</span></label>
                                <input type="tel" id="telefonoAcompanante" v-model="telefonoAcompanante"
                                    v-bind="telefonoAcompananteAttrs" maxlength="9" placeholder="999999999"
                                    class="w-full px-3 py-2 border rounded-lg text-sm"
                                    :class="{ 'border-red-500 bg-red-50': errors.telefonoAcompanante, 'border-gray-300': !errors.telefonoAcompanante }" />
                                <span v-if="errors.telefonoAcompanante" class="text-red-500 text-xs mt-1">{{
                                    errors.telefonoAcompanante }}</span>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>



            <!-- Sección 6: Síntomas (AI Enhanced) -->
            <div class="bg-white rounded-xl shadow-md p-5">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <HeartIcon class="w-5 h-5 text-red-600" />
                    </div>
                    <div class="flex-1">
                        <h2 class="font-bold text-gray-800">Motivo de Consulta</h2>
                        <p class="text-xs text-gray-500">Describa los síntomas del paciente <span
                                class="text-red-500">*</span></p>
                    </div>
                    <!-- AI Button -->
                    <button type="button" @click="recomendarArea" :disabled="!sintomas || isRecommending"
                        class="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-2 hover:from-violet-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <SparklesIcon class="w-4 h-4" v-if="!isRecommending" />
                        <ArrowPathIcon class="w-4 h-4 animate-spin" v-else />
                        {{ isRecommending ? 'Analizando...' : 'Recomendar Área con IA' }}
                    </button>
                </div>
                <textarea id="sintomas" v-model="sintomas" v-bind="sintomasAttrs" rows="3"
                    placeholder="Describa los síntomas iniciales del paciente... (Ej: Dolor de cabeza intenso y visión borrosa)"
                    class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 resize-none transition-colors"
                    :class="{ 'border-red-500 bg-red-50': errors.sintomas, 'border-gray-300': !errors.sintomas }"></textarea>
                <span v-if="errors.sintomas" class="text-red-500 text-xs mt-1">{{ errors.sintomas }}</span>
                <!-- AI Recommendation Result -->
                <transition enter-active-class="transition ease-out duration-300"
                    enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0">
                    <div v-if="recomendacion"
                        class="mt-3 bg-violet-50 border border-violet-200 rounded-lg p-4 relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-2 opacity-10">
                            <SparklesIcon class="w-24 h-24 text-violet-600" />
                        </div>
                        <h4 class="font-bold text-violet-900 text-sm flex items-center gap-2 mb-1">
                            <SparklesIcon class="w-4 h-4 text-violet-600" />
                            Área Recomendada: {{ recomendacion.nombre_area }}
                        </h4>
                        <p class="text-violet-700 text-xs leading-relaxed max-w-[90%]">
                            {{ recomendacion.razon }}
                        </p>
                        <div class="mt-2 flex gap-2 items-center">
                            <div
                                class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white text-violet-600 border border-violet-200 capitalize">
                                Urgencia {{ recomendacion.nivel_urgencia }}
                            </div>
                            <button type="button" @click="aplicarRecomendacion"
                                class="text-[10px] font-bold text-violet-700 hover:underline flex items-center gap-1 ml-auto z-10">
                                Seleccionar esta área
                                <ArrowRightIcon class="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Sección de Programación de Cita -->
            <div class="mt-8 border-t pt-8">
                <!-- Indicador de Progreso -->
                <div class="mb-8">
                    <div class="flex items-center justify-center gap-4">
                        <div class="flex items-center gap-2">
                            <div :class="[
                                'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                                areaSeleccionada ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-600 ring-2 ring-teal-600'
                            ]">
                                <CheckIcon v-if="areaSeleccionada" class="w-4 h-4" />
                                <span v-else>1</span>
                            </div>
                            <span class="text-sm font-medium text-gray-700 hidden sm:block">Área</span>
                        </div>
                        <div class="w-12 h-1 rounded" :class="areaSeleccionada ? 'bg-teal-600' : 'bg-gray-300'"></div>
                        <div class="flex items-center gap-2">
                            <div :class="[
                                'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                                medicoSeleccionado ? 'bg-teal-600 text-white' : areaSeleccionada ? 'bg-teal-100 text-teal-600 ring-2 ring-teal-600' : 'bg-gray-200 text-gray-400'
                            ]">
                                <CheckIcon v-if="medicoSeleccionado" class="w-4 h-4" />
                                <span v-else>2</span>
                            </div>
                            <span class="text-sm font-medium hidden sm:block"
                                :class="areaSeleccionada ? 'text-gray-700' : 'text-gray-400'">Médico</span>
                        </div>
                        <div class="w-12 h-1 rounded" :class="medicoSeleccionado ? 'bg-teal-600' : 'bg-gray-300'"></div>
                        <div class="flex items-center gap-2">
                            <div :class="[
                                'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                                horarioSeleccionado ? 'bg-teal-600 text-white' : medicoSeleccionado ? 'bg-teal-100 text-teal-600 ring-2 ring-teal-600' : 'bg-gray-200 text-gray-400'
                            ]">
                                <CheckIcon v-if="horarioSeleccionado" class="w-4 h-4" />
                                <span v-else>3</span>
                            </div>
                            <span class="text-sm font-medium hidden sm:block"
                                :class="medicoSeleccionado ? 'text-gray-700' : 'text-gray-400'">Horario</span>
                        </div>
                    </div>
                </div>

                <!-- Paso 1: Seleccionar Área -->
                <div class="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-100">
                    <h2 class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <div class="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center">
                            <BuildingOfficeIcon class="w-4 h-4" />
                        </div>
                        Paso 1: Seleccionar Área de Atención
                    </h2>
                    <p class="text-gray-600 text-sm mb-4">
                        Elija el área médica donde desea agendar la cita. Cada área cuenta con médicos especializados
                        para brindarle la mejor atención.
                    </p>

                    <!-- Grid de Áreas como tarjetas -->
                    <!-- Skeleton Loader para servicios -->
                    <div v-if="isLoadingAreas" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <div v-for="n in 8" :key="n"
                            class="p-4 rounded-xl border border-gray-200 animate-pulse bg-white">
                            <div class="flex flex-col items-center">
                                <div class="w-12 h-12 bg-gray-200 rounded-xl mb-2"></div>
                                <div class="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                <div class="h-3 bg-gray-100 rounded w-32 mt-1"></div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <div v-for="area in areas" :key="area.id" @click="handleAreaClick(area)" :class="[
                            'relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group',
                            areaSeleccionada?.id === area.id
                                ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-200 scale-[1.02]'
                                : 'bg-white border-gray-200 hover:border-teal-400 hover:shadow-md'
                        ]">
                            <!-- Icono check cuando está seleccionado -->
                            <div v-if="areaSeleccionada?.id === area.id"
                                class="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                <CheckIcon class="w-3 h-3 text-teal-600 font-bold" />
                            </div>

                            <div class="flex flex-col items-center text-center">
                                <div :class="[
                                    'w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors',
                                    areaSeleccionada?.id === area.id
                                        ? 'bg-white/20'
                                        : 'bg-teal-100 group-hover:bg-teal-200'
                                ]">
                                    <component :is="getAreaIcon(area.nombre)" :class="[
                                        'w-5 h-5',
                                        areaSeleccionada?.id === area.id ? 'text-white' : 'text-teal-600'
                                    ]" />
                                </div>
                                <span :class="[
                                    'font-semibold text-sm leading-tight',
                                    areaSeleccionada?.id === area.id ? 'text-white' : 'text-gray-800'
                                ]">{{ area.nombre }}</span>
                                <!-- Descripción del área -->
                                <p v-if="area.descripcion" :class="[
                                    'text-xs mt-1 leading-tight line-clamp-2',
                                    areaSeleccionada?.id === area.id ? 'text-teal-100' : 'text-gray-500'
                                ]">{{ area.descripcion }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Paso 2: Seleccionar Médico -->
            <transition enter-active-class="transition ease-out duration-300"
                enter-from-class="opacity-0 transform translate-y-4"
                enter-to-class="opacity-100 transform translate-y-0">
                <div v-if="areaSeleccionada" class="mt-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h2 class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <div class="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                            <UsersIcon class="w-4 h-4" />
                        </div>
                        Paso 2: Seleccionar Médico
                    </h2>
                    <p class="text-gray-600 text-sm mb-4">
                        Médicos disponibles en <span class="font-semibold text-teal-700">{{ areaSeleccionada.nombre
                            }}</span>
                    </p>

                    <!-- Skeleton Loader para médicos -->
                    <div v-if="isLoadingMedicos" class="space-y-4">
                        <div class="flex items-center gap-2 text-teal-600">
                            <ArrowPathIcon class="w-5 h-5 animate-spin" />
                            <span class="font-medium">Buscando médicos disponibles...</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="n in 2" :key="n" class="border border-gray-200 rounded-xl p-4 animate-pulse">
                                <div class="flex items-center gap-4">
                                    <div class="w-14 h-14 bg-gray-200 rounded-full"></div>
                                    <div class="flex-1">
                                        <div class="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Mensaje cuando no hay médicos -->
                    <div v-else-if="medicosDisponibles.length === 0"
                        class="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
                        <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <ExclamationTriangleIcon class="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h4 class="font-bold text-amber-800 mb-1">No hay médicos disponibles</h4>
                            <p class="text-amber-700 text-sm">
                                No se encontraron médicos asignados al área de <strong>{{ areaSeleccionada.nombre
                                    }}</strong>.
                                Por favor, seleccione otra área o contacte al administrador.
                            </p>
                            <button @click="areaSeleccionada = null" type="button"
                                class="mt-3 text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                                <ArrowLeftIcon class="w-3 h-3" />
                                Elegir otra área
                            </button>
                        </div>
                    </div>

                    <!-- Grid de Médicos -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="medico in medicosDisponibles" :key="medico.id" @click="seleccionarMedico(medico)"
                            :class="[
                                'relative rounded-xl p-4 cursor-pointer transition-all duration-200 border-2',
                                medicoSeleccionado?.id === medico.id
                                    ? 'bg-blue-50 border-blue-500 shadow-lg shadow-blue-100'
                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                            ]">
                            <!-- Badge de selección -->
                            <div v-if="medicoSeleccionado?.id === medico.id"
                                class="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                                <CheckIcon class="w-3 h-3 text-white font-bold" />
                            </div>

                            <div class="flex items-center gap-4">
                                <!-- Avatar del médico -->
                                <div :class="[
                                    'w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 transition-colors',
                                    medicoSeleccionado?.id === medico.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700'
                                ]">
                                    {{ getInitials(medico.name) }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 :class="[
                                        'font-bold truncate',
                                        medicoSeleccionado?.id === medico.id ? 'text-blue-800' : 'text-gray-800'
                                    ]">{{ medico.name }}</h4>
                                    <div v-if="medico.disponibilidad">
                                        <div v-if="medico.disponibilidad.turnos > 0 && medico.disponibilidad.cupos > 0"
                                            class="flex flex-col gap-0.5 mt-1">
                                            <div class="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                                                <CheckCircleIcon class="w-3 h-3" />
                                                {{ medico.disponibilidad.turnos }} turnos programados
                                            </div>
                                            <div class="text-xs text-blue-600 flex items-center gap-1 font-medium pl-4">
                                                {{ medico.disponibilidad.cupos }} cupos disponibles
                                            </div>
                                        </div>
                                        <div v-else-if="medico.disponibilidad.turnos > 0 && medico.disponibilidad.cupos === 0"
                                            class="flex flex-col gap-0.5 mt-1">
                                            <div class="text-xs text-amber-600 flex items-center gap-1 font-bold">
                                                <ExclamationCircleIcon class="w-3 h-3" />
                                                Sin cupos libres
                                            </div>
                                            <div class="text-xs text-gray-500 pl-4">
                                                (Turnos llenos)
                                            </div>
                                        </div>
                                        <div v-else
                                            class="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
                                            <ExclamationCircleIcon class="w-3 h-3" />
                                            Sin turnos disponibles
                                        </div>
                                    </div>
                                    <p v-else class="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        <CalendarIcon class="w-3 h-3" />
                                        Consultar disponibilidad
                                    </p>
                                </div>
                                <ChevronRightIcon :class="[
                                    'w-5 h-5 transition-transform',
                                    medicoSeleccionado?.id === medico.id ? 'text-blue-600 translate-x-1' : 'text-gray-400'
                                ]" />
                            </div>
                        </div>
                    </div>
                </div>
            </transition>

            <!-- Paso 3: Calendario de Disponibilidad -->
            <transition enter-active-class="transition ease-out duration-300"
                enter-from-class="opacity-0 transform translate-y-4"
                enter-to-class="opacity-100 transform translate-y-0">
                <div v-if="medicoSeleccionado" class="mt-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h2 class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <div class="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center">
                            <CalendarIcon class="w-4 h-4" />
                        </div>
                        Paso 3: Seleccionar Fecha y Hora
                    </h2>
                    <p class="text-gray-600 text-sm mb-4">
                        Disponibilidad de <span class="font-semibold text-blue-700">{{ medicoSeleccionado.name }}</span>
                    </p>

                    <!-- Skeleton Loader para horarios -->
                    <div v-if="isLoadingHorarios" class="space-y-4">
                        <div class="flex items-center gap-2 text-purple-600">
                            <ArrowPathIcon class="w-5 h-5 animate-spin" />
                            <span class="font-medium">Cargando disponibilidad del médico...</span>
                        </div>

                        <!-- Skeleton del calendario -->
                        <div class="animate-pulse">
                            <div class="flex justify-between items-center mb-4">
                                <div class="h-8 bg-gray-200 rounded w-32"></div>
                                <div class="flex gap-2">
                                    <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                    <div class="w-24 h-10 bg-gray-200 rounded-lg"></div>
                                    <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                            <div class="grid grid-cols-7 gap-2 mb-4">
                                <div v-for="n in 7" :key="n" class="h-10 bg-gray-200 rounded"></div>
                            </div>
                            <div class="grid grid-cols-7 gap-2">
                                <div v-for="n in 35" :key="n"
                                    class="h-20 bg-gray-100 rounded-lg border border-gray-200"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Contenido del calendario -->
                    <div v-else>
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-lg font-semibold text-gray-800">
                                {{ nombreMesActual }} {{ añoActual }}
                            </span>
                            <div class="flex gap-2">
                                <button type="button" @click="cambiarMes(-1)"
                                    class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
                                    <ChevronLeftIcon class="w-5 h-5" />
                                </button>
                                <button type="button" @click="cambiarMes(1)"
                                    class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
                                    <ChevronRightIcon class="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-7 gap-2 mb-4">
                            <div v-for="dia in diasSemana" :key="dia"
                                class="text-center font-semibold text-gray-600 py-2 bg-gray-100 rounded-lg text-sm">
                                {{ dia }}
                            </div>
                        </div>

                        <div class="grid grid-cols-7 gap-2">
                            <div v-for="(dia, index) in diasCalendario" :key="index"
                                @click="dia.esDelMes && dia.disponible ? seleccionarDia(dia) : null" :class="[
                                    'p-3 rounded-lg border min-h-[100px] transition',
                                    dia.esDelMes ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100',
                                    dia.disponible && dia.esDelMes ? 'cursor-pointer hover:border-teal-400 hover:bg-teal-50' : '',
                                    !dia.disponible && dia.esDelMes ? 'opacity-50' : '',
                                    diaSeleccionado?.fecha === dia.fecha ? 'border-teal-500 border-2 bg-teal-50' : ''
                                ]">
                                <div v-if="dia.esDelMes">
                                    <div class="font-semibold text-gray-700 mb-1">{{ dia.numero }}</div>
                                    <div v-if="dia.disponible" class="space-y-1">
                                        <!-- Turno Mañana -->
                                        <div v-for="horario in dia.horarios.filter((h: Horario) => h.turno === 'M')"
                                            :key="'m-' + horario.id"
                                            class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded flex items-center gap-1">
                                            <SunIcon class="w-3 h-3" />
                                            <span class="font-semibold">{{ horario.cupos_disponibles }}/{{ horario.cupos
                                            }}</span>
                                        </div>
                                        <!-- Turno Tarde -->
                                        <div v-for="horario in dia.horarios.filter((h: Horario) => h.turno === 'T')"
                                            :key="'t-' + horario.id"
                                            class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded flex items-center gap-1">
                                            <MoonIcon class="w-3 h-3" />
                                            <span class="font-semibold">{{ horario.cupos_disponibles }}/{{ horario.cupos
                                            }}</span>
                                        </div>
                                    </div>
                                    <div v-else class="text-xs text-gray-400">No disponible</div>
                                </div>
                            </div>
                        </div>

                        <!-- Selección de horario específico -->
                        <transition enter-active-class="transition ease-out duration-300">
                            <div v-if="diaSeleccionado"
                                class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                                <h3 class="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                    <ClockIcon class="w-5 h-5" />
                                    Turnos disponibles para {{ diaSeleccionado.fechaCompleta }}
                                </h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Turno Mañana -->
                                    <div v-for="horario in diaSeleccionado.horarios.filter((h: Horario) => h.turno === 'M')"
                                        :key="'sel-m-' + horario.id">
                                        <button type="button" @click="seleccionarHorario(horario)"
                                            :disabled="horario.cupos_disponibles === 0" :class="[
                                                'w-full p-4 rounded-xl border-2 transition-all',
                                                horarioSeleccionado?.id === horario.id
                                                    ? 'border-amber-500 bg-amber-100 shadow-lg shadow-amber-200'
                                                    : horario.cupos_disponibles > 0
                                                        ? 'border-amber-200 bg-white hover:border-amber-400 hover:shadow-md'
                                                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                            ]">
                                            <div class="flex items-center gap-3">
                                                <div :class="[
                                                    'w-12 h-12 rounded-full flex items-center justify-center',
                                                    horarioSeleccionado?.id === horario.id ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600'
                                                ]">
                                                    <SunIcon class="w-6 h-6" />
                                                </div>
                                                <div class="text-left flex-1">
                                                    <div class="font-bold text-gray-800">Turno Mañana</div>
                                                    <div class="text-sm text-gray-600">{{
                                                        horario.hora_inicio?.slice(0, 5) }} - {{
                                                            horario.hora_fin?.slice(0, 5) }}</div>
                                                </div>
                                                <div class="text-right">
                                                    <div :class="[
                                                        'text-2xl font-bold',
                                                        horario.cupos_disponibles > 0 ? 'text-amber-600' : 'text-gray-400'
                                                    ]">{{ horario.cupos_disponibles }}</div>
                                                    <div class="text-xs text-gray-500">cupos</div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    <!-- Turno Tarde -->
                                    <div v-for="horario in diaSeleccionado.horarios.filter((h: Horario) => h.turno === 'T')"
                                        :key="'sel-t-' + horario.id">
                                        <button type="button" @click="seleccionarHorario(horario)"
                                            :disabled="horario.cupos_disponibles === 0" :class="[
                                                'w-full p-4 rounded-xl border-2 transition-all',
                                                horarioSeleccionado?.id === horario.id
                                                    ? 'border-indigo-500 bg-indigo-100 shadow-lg shadow-indigo-200'
                                                    : horario.cupos_disponibles > 0
                                                        ? 'border-indigo-200 bg-white hover:border-indigo-400 hover:shadow-md'
                                                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                            ]">
                                            <div class="flex items-center gap-3">
                                                <div :class="[
                                                    'w-12 h-12 rounded-full flex items-center justify-center',
                                                    horarioSeleccionado?.id === horario.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600'
                                                ]">
                                                    <MoonIcon class="w-6 h-6" />
                                                </div>
                                                <div class="text-left flex-1">
                                                    <div class="font-bold text-gray-800">Turno Tarde</div>
                                                    <div class="text-sm text-gray-600">{{
                                                        horario.hora_inicio?.slice(0, 5) }} - {{
                                                            horario.hora_fin?.slice(0, 5) }}</div>
                                                </div>
                                                <div class="text-right">
                                                    <div :class="[
                                                        'text-2xl font-bold',
                                                        horario.cupos_disponibles > 0 ? 'text-indigo-600' : 'text-gray-400'
                                                    ]">{{ horario.cupos_disponibles }}</div>
                                                    <div class="text-xs text-gray-500">cupos</div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <!-- Mensaje si no hay horarios disponibles -->
                                <div v-if="diaSeleccionado.horarios.length === 0"
                                    class="text-center py-4 text-gray-500 flex justify-center items-center gap-2">
                                    <InformationCircleIcon class="w-5 h-5" />
                                    No hay turnos configurados para este día
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </transition>

            <!-- Botones -->
            <div class="flex flex-col sm:flex-row gap-4 mt-8">
                <button type="submit" :disabled="!horarioSeleccionado || isSubmitting" :class="[
                    'flex-1 font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md flex items-center justify-center gap-2',
                    horarioSeleccionado && !isSubmitting
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                ]">
                    <ArrowPathIcon v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                    <CheckIcon v-else class="w-5 h-5" />
                    {{ isSubmitting ? 'Registrando...' : 'Registrar Paciente y Asignar Cita' }}
                </button>
                <button type="button" @click="resetForm"
                    class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <XMarkIcon class="w-5 h-5" />
                    Limpiar Formulario
                </button>
            </div>
        </form>

        <!-- Mensaje de éxito -->
        <transition enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 transform translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform translate-y-2">
            <div v-if="showSuccess"
                class="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center justify-center shadow-md">
                <CheckCircleIcon class="w-5 h-5 mr-2" />
                <span class="font-medium">Paciente registrado y cita asignada exitosamente</span>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import Swal from 'sweetalert2';
import pacienteService from "../../services/pacienteService";
import horarioService from "../../services/horarioService";
import citaService from "../../services/citaService";
import api from "../../services/api";
import {
    MagnifyingGlassIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    UserIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    InformationCircleIcon,
    UsersIcon,
    IdentificationIcon,
    HeartIcon,
    CheckIcon,
    BuildingOfficeIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    CalendarIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    SunIcon,
    MoonIcon,
    ClockIcon,
    XMarkIcon,
    WrenchIcon,
    ShareIcon,
    ChatBubbleLeftRightIcon,
    EyeIcon,
    StarIcon,
    BeakerIcon,
    PhotoIcon,
    CogIcon,
    SparklesIcon,
    ArrowRightIcon
} from '@heroicons/vue/24/outline'
import HsDatePicker from '../common/HsDatePicker.vue';

interface Medico {
    id: number;
    name: string;
    disponibilidad?: {
        turnos: number;
        cupos: number;
    };
}

interface Horario {
    id: number;
    hora_inicio: string;
    hora_fin: string;
    cupos: number;
    cupos_disponibles: number;
    dia_semana: number;
    turno: 'M' | 'T';
    turno_nombre?: string;
    fecha?: string;
}

interface DiaCalendario {
    esDelMes: boolean;
    numero: number;
    fecha: string;
    fechaCompleta: string;
    disponible: boolean;
    horarios: Horario[];
}

interface Area {
    id: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
}

// Esquema de validación
const schema = yup.object({
    dni: yup.string().required('El DNI es obligatorio').length(8, 'El DNI debe tener 8 dígitos').matches(/^[0-9]+$/, 'Solo números'),
    nombres: yup.string().required('Los nombres son obligatorios'),
    apellidoPaterno: yup.string().required('El apellido paterno es obligatorio'),
    apellidoMaterno: yup.string().required('El apellido materno es obligatorio'),
    fechaNacimiento: yup.string().required('La fecha de nacimiento es obligatoria'),
    sexo: yup.string().required('El sexo es obligatorio'),
    estado_civil: yup.string().required('El estado civil es obligatorio'),
    gradoInstruccion: yup.string().required('El grado de instrucción es obligatorio'),
    ocupacion: yup.string().required('La ocupación es obligatoria'),
    religion: yup.string().required('La religión es obligatoria'),
    procedencia: yup.string().required('La procedencia es obligatoria'),
    telefono: yup.string().required('El teléfono es obligatorio'),
    email: yup.string().email('El email no es válido').nullable(),
    direccion: yup.string().required('La dirección es obligatoria'),
    dniAcompanante: yup.string().required('El DNI del acompañante es obligatorio').length(8, 'Debe tener 8 dígitos'),
    nombreAcompanante: yup.string().required('El nombre del acompañante es obligatorio'),
    telefonoAcompanante: yup.string().required('El teléfono del acompañante es obligatorio'),
    sintomas: yup.string().required('Los síntomas son obligatorios'),
    area: yup.string().required('El área de atención es obligatoria'),
    numeroSis: yup.string().required('El número de afiliación es obligatorio'),
    tipoSeguro: yup.string().required('El tipo de seguro es obligatorio'),

});

const { handleSubmit, resetForm: resetVeeForm, setValues, values, errors, defineField } = useForm({
    validationSchema: schema,
    initialValues: {
        dni: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        fechaNacimiento: "",
        sexo: "",
        estado_civil: "",
        religion: "",
        procedencia: "",
        telefono: "",
        email: "",
        direccion: "",
        dniAcompanante: "",
        nombreAcompanante: "",
        telefonoAcompanante: "",
        gradoInstruccion: "",
        ocupacion: "",
        sintomas: "",
        numeroSis: "",
        tipoSeguro: "",
        area: "",

    }
});

// Estado de las secciones colapsables
const seccionesAbiertas = ref({
    datosPersonales: true,
    datosAdicionales: true,
    acompanante: true, // Obligatorio, abierto por defecto
    afiliacion: true // Obligatorio, abierto por defecto
});

// Mapeo de campos a secciones para abrir automáticamente
const getSeccionPorCampo = (campo: string): 'datosPersonales' | 'datosAdicionales' | 'acompanante' | 'afiliacion' | null => {
    const datosPersonales = ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'sexo', 'estado_civil', 'telefono', 'email', 'direccion'];
    const datosAdicionales = ['gradoInstruccion', 'ocupacion', 'religion', 'procedencia'];
    const acompanante = ['dniAcompanante', 'nombreAcompanante', 'telefonoAcompanante'];
    const afiliacion = ['numeroSis', 'tipoSeguro'];

    if (datosPersonales.includes(campo)) return 'datosPersonales';
    if (datosAdicionales.includes(campo)) return 'datosAdicionales';
    if (acompanante.includes(campo)) return 'acompanante';
    if (afiliacion.includes(campo)) return 'afiliacion';
    return null;
};

// Función para scroll al primer error con efecto visual
const scrollToFirstError = () => {
    // Obtener las claves de los errores
    const errorKeys = Object.keys(errors.value);
    if (errorKeys.length === 0) return;

    const firstErrorField = errorKeys[0];
    if (!firstErrorField) return;

    // Abrir la sección correspondiente si está cerrada
    const seccion = getSeccionPorCampo(firstErrorField);
    if (seccion && !seccionesAbiertas.value[seccion]) {
        seccionesAbiertas.value[seccion] = true;
    }

    // Esperar a que la sección se abra (transición)
    setTimeout(() => {
        // Buscar el elemento con error por id
        const errorElement = document.getElementById(firstErrorField) as HTMLElement;
        if (errorElement) {
            // Scroll suave hasta el elemento
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Esperar a que termine el scroll para aplicar el efecto
            setTimeout(() => {
                errorElement.focus();

                // Agregar efecto de pulso/parpadeo
                errorElement.style.transition = 'all 0.2s ease';

                // Función para crear el efecto de pulso
                const pulseEffect = () => {
                    errorElement.style.transform = 'scale(1.02)';
                    errorElement.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.6)';

                    setTimeout(() => {
                        errorElement.style.transform = 'scale(1)';
                        errorElement.style.boxShadow = 'none';
                    }, 200);
                };

                // Ejecutar el pulso 3 veces
                pulseEffect();
                setTimeout(pulseEffect, 400);
                setTimeout(pulseEffect, 800);

                // Limpiar estilos después de la animación
                setTimeout(() => {
                    errorElement.style.transition = '';
                    errorElement.style.transform = '';
                    errorElement.style.boxShadow = '';
                }, 1200);
            }, 500);
        }
    }, 350);
};

// Definición de campos para v-model y validación
const [dni, dniAttrs] = defineField('dni');
const [nombres, nombresAttrs] = defineField('nombres');
const [apellidoPaterno, apellidoPaternoAttrs] = defineField('apellidoPaterno');
const [apellidoMaterno, apellidoMaternoAttrs] = defineField('apellidoMaterno');
const [fechaNacimiento] = defineField('fechaNacimiento');
const [sexo, sexoAttrs] = defineField('sexo');
const [estado_civil, estadoCivilAttrs] = defineField('estado_civil');
const [gradoInstruccion, gradoInstruccionAttrs] = defineField('gradoInstruccion');
const [ocupacion, ocupacionAttrs] = defineField('ocupacion');
const [religion, religionAttrs] = defineField('religion');
const [procedencia, procedenciaAttrs] = defineField('procedencia');
const [telefono, telefonoAttrs] = defineField('telefono');
const [email, emailAttrs] = defineField('email');
const [direccion, direccionAttrs] = defineField('direccion');
const [dniAcompanante, dniAcompananteAttrs] = defineField('dniAcompanante');
const [nombreAcompanante, nombreAcompananteAttrs] = defineField('nombreAcompanante');
const [telefonoAcompanante, telefonoAcompananteAttrs] = defineField('telefonoAcompanante');
const [sintomas, sintomasAttrs] = defineField('sintomas');
const [numeroSis, numeroSisAttrs] = defineField('numeroSis');
const [tipoSeguro, tipoSeguroAttrs] = defineField('tipoSeguro');



const showSuccess = ref(false);
const areas = ref<Area[]>([]);
const areaSeleccionada = ref<Area | null>(null);
const medicosDisponibles = ref<Medico[]>([]);
const medicoSeleccionado = ref<Medico | null>(null);
const isLoadingMedicos = ref(false);
const isLoadingHorarios = ref(false);
const isSearching = ref(false);
const isSearchingAcompanante = ref(false);
const isSubmitting = ref(false);
const searchMessage = ref<{ text: string; type: "success" | "error" }>({
    text: "",
    type: "success",
});
const pacienteId = ref<number | null>(null);

const mesActual = ref(new Date().getMonth());
const añoActual = ref(new Date().getFullYear());
const horariosDelMes = ref<any[]>([]);
const diaSeleccionado = ref<DiaCalendario | null>(null);
const horarioSeleccionado = ref<Horario | null>(null);

// New refs for AI
const isRecommending = ref(false);
const recomendacion = ref<{ area_id: number, nombre_area: string, razon: string, nivel_urgencia: string } | null>(null);
const recomendarArea = async () => {
    if (!values.sintomas) return;
    isRecommending.value = true;
    recomendacion.value = null;
    try {
        const { data } = await api.post('/areas/recomendar', {
            sintomas: values.sintomas
        });
        recomendacion.value = data;

        // Optional: Auto-select immediately? 
        // For better UX, we let the user confirm by clicking "Seleccionar esta área"
    } catch (error) {
        console.error("Error al recomendar área", error);
        // You can use a toast here instead of alert
        searchMessage.value = { text: "No se pudo obtener una recomendación.", type: "error" };
    } finally {
        isRecommending.value = false;
    }
};
const aplicarRecomendacion = async () => {
    if (recomendacion.value && recomendacion.value.area_id) {
        const areaEncontrada = areas.value.find(a => a.id === recomendacion.value?.area_id);
        if (areaEncontrada) {
            // 1. Seleccionar el Área
            await seleccionarArea(areaEncontrada);

            // 2. Buscar el horario más próximo disponible en esta área
            try {
                // Obtener horarios para el área y el mes actual
                const hoy = new Date();
                let mesStr = `${añoActual.value}-${String(mesActual.value + 1).padStart(2, '0')}`;

                // Buscar horarios en todo el área (sin filtrar por médico aún)
                let { data: horariosArea } = await horarioService.getHorarios({
                    area_id: areaEncontrada.id,
                    mes: mesStr
                });

                // Si no hay horarios o estamos a fin de mes, buscar también en el mes siguiente
                if (!horariosArea || horariosArea.length === 0 || hoy.getDate() > 20) {
                    const proximoMes = mesActual.value === 11 ? 0 : mesActual.value + 1;
                    const proximoAno = mesActual.value === 11 ? añoActual.value + 1 : añoActual.value;
                    const mesSiguienteStr = `${proximoAno}-${String(proximoMes + 1).padStart(2, '0')}`;

                    const { data: horariosSiguiente } = await horarioService.getHorarios({
                        area_id: areaEncontrada.id,
                        mes: mesSiguienteStr
                    });
                    if (horariosSiguiente) {
                        horariosArea = [...(horariosArea || []), ...horariosSiguiente];
                    }
                }

                if (!horariosArea || horariosArea.length === 0) {
                    console.log("No se encontraron horarios para recomendación automática");
                    return;
                }

                // Filtrar y ordenar para encontrar el más próximo
                // Nota: Asumimos que la API devuelve cupos_disponibles o usamos cupos
                const horariosValidos = horariosArea
                    .map((h: any) => ({
                        ...h,
                        cupos_disponibles: h.cupos_disponibles ?? h.cupos,
                        fechaObj: new Date(`${h.fecha}T${h.hora_inicio}`)
                    }))
                    .filter((h: any) =>
                        h.cupos_disponibles > 0 &&
                        h.fechaObj > hoy
                    )
                    .sort((a: any, b: any) => a.fechaObj.getTime() - b.fechaObj.getTime());

                if (horariosValidos.length > 0) {
                    const mejorHorario = horariosValidos[0];
                    console.log("Mejor horario encontrado:", mejorHorario);

                    // 3. Seleccionar el Médico del mejor horario
                    const medicoDelHorario = medicosDisponibles.value.find(m => m.id === mejorHorario.medico_id);
                    if (medicoDelHorario) {
                        await seleccionarMedico(medicoDelHorario);

                        // 4. Seleccionar el Día (asegurarnos que estamos en el mes correcto)
                        const fechaHorario = new Date(mejorHorario.fecha + 'T00:00:00');
                        // Si el horario es de otro mes/año, cambiar el calendario
                        if (fechaHorario.getMonth() !== mesActual.value || fechaHorario.getFullYear() !== añoActual.value) {
                            mesActual.value = fechaHorario.getMonth();
                            añoActual.value = fechaHorario.getFullYear();
                            // Recargar horarios del médico para el nuevo mes
                            await cargarHorariosDelMes();
                        }

                        // Buscar el día en el calendario ya computado
                        const diaEnCalendario = diasCalendario.value.find(d => d.fecha === mejorHorario.fecha);
                        if (diaEnCalendario) {
                            seleccionarDia(diaEnCalendario);

                            // 5. Seleccionar el Horario específico
                            // Buscar en los horarios del día seleccionado (que vienen de diasCalendario > horariosDelMes)
                            if (diaSeleccionado.value) {
                                const horarioFinal = diaSeleccionado.value.horarios.find((h: Horario) => h.id === mejorHorario.id);
                                if (horarioFinal && horarioFinal.cupos_disponibles > 0) {
                                    seleccionarHorario(horarioFinal);

                                    // Scroll suave al final para mostrar que ya está todo listo
                                    setTimeout(() => {
                                        const botonSubmit = document.querySelector('button[type="submit"]');
                                        if (botonSubmit) botonSubmit.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }, 500);
                                }
                            }
                        }
                    }
                }

            } catch (error) {
                console.error("Error al automátizar selección:", error);
            }
        }
    }
};

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Fecha de hoy para limitar fechas de nacimiento
const todayDate = computed(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

const nombreMesActual = computed(() => nombresMeses[mesActual.value]);

const diasCalendario = computed(() => {
    const primerDia = new Date(añoActual.value, mesActual.value, 1);
    const ultimoDia = new Date(añoActual.value, mesActual.value + 1, 0);
    const diasEnMes = ultimoDia.getDate();

    const dias: DiaCalendario[] = [];
    const primerDiaSemana = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;

    for (let i = 0; i < primerDiaSemana; i++) {
        dias.push({
            esDelMes: false,
            numero: 0,
            fecha: '',
            fechaCompleta: '',
            disponible: false,
            horarios: []
        });
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = new Date(añoActual.value, mesActual.value, dia);
        const fechaStr = `${añoActual.value}-${String(mesActual.value + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        // Filtrar horarios que coincidan con esta fecha específica
        const horariosDelDia = horariosDelMes.value.filter((h: Horario) => h.fecha === fechaStr);

        dias.push({
            esDelMes: true,
            numero: dia,
            fecha: fechaStr,
            fechaCompleta: fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            disponible: horariosDelDia.length > 0 && horariosDelDia.some((h: Horario) => h.cupos_disponibles > 0),
            horarios: horariosDelDia
        });
    }

    return dias;
});



// Datos de doctores cargados dinámicamente


const calculatedEdad = computed(() => {
    if (!values.fechaNacimiento) {
        return '';
    }
    const birthDate = new Date(values.fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 0 ? age.toString() : '';
});

const isLoadingAreas = ref(false);

const fetchAreas = async () => {
    isLoadingAreas.value = true;
    try {
        const { data } = await api.get('/areas/');
        // Solo mostrar áreas con estado activo
        areas.value = data.filter((area: Area) => area.activo === true);
    } catch (error) {
        console.error("Error al cargar áreas", error);
    } finally {
        isLoadingAreas.value = false;
    }
};


const handleAreaClick = (area: Area) => {
    seleccionarArea(area);
};

const getAreaIcon = (nombre: string) => {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('medicina') || nombreLower.includes('general')) return HeartIcon;
    if (nombreLower.includes('pediatr')) return UsersIcon;
    if (nombreLower.includes('gineco') || nombreLower.includes('obstetr')) return HeartIcon;
    if (nombreLower.includes('cardio')) return HeartIcon;
    if (nombreLower.includes('trauma') || nombreLower.includes('ortoped')) return WrenchIcon;
    if (nombreLower.includes('neuro')) return ShareIcon;
    if (nombreLower.includes('derma')) return SunIcon;
    if (nombreLower.includes('psico') || nombreLower.includes('psiqui')) return ChatBubbleLeftRightIcon;
    if (nombreLower.includes('oftalmo')) return EyeIcon;
    if (nombreLower.includes('odonto') || nombreLower.includes('dental')) return StarIcon;
    if (nombreLower.includes('laboratorio')) return BeakerIcon;
    if (nombreLower.includes('rayos') || nombreLower.includes('imagen')) return PhotoIcon;
    if (nombreLower.includes('urgencia') || nombreLower.includes('emergencia')) return ExclamationTriangleIcon;
    if (nombreLower.includes('cirug')) return CogIcon;
    return BuildingOfficeIcon;
};

const getInitials = (name: string): string => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const seleccionarArea = async (area: Area) => {
    areaSeleccionada.value = area;
    medicoSeleccionado.value = null;
    diaSeleccionado.value = null;
    horarioSeleccionado.value = null;
    medicosDisponibles.value = [];
    isLoadingMedicos.value = true;
    setValues({ ...values, area: String(area.id) });

    try {
        const { data } = await api.get(`/auth/medicos?area_id=${area.id}`);
        medicosDisponibles.value = data.map((medico: any) => ({
            id: medico.id,
            name: medico.nombres_completos,
            disponibilidad: medico.disponibilidad
        }));
    } catch (error) {
        console.error('Error al cargar médicos', error);
        medicosDisponibles.value = [];
    } finally {
        isLoadingMedicos.value = false;
    }
};

const seleccionarMedico = async (medico: Medico) => {
    medicoSeleccionado.value = medico;
    diaSeleccionado.value = null;
    horarioSeleccionado.value = null;
    horariosDelMes.value = [];
    isLoadingHorarios.value = true;

    await cargarHorariosDelMes();
};

const cargarHorariosDelMes = async () => {
    if (!medicoSeleccionado.value || !areaSeleccionada.value) return;

    try {
        // Construir el parámetro de mes en formato YYYY-MM
        const mesParam = `${añoActual.value}-${String(mesActual.value + 1).padStart(2, '0')}`;

        const { data } = await horarioService.getHorarios({
            medico_id: medicoSeleccionado.value.id,
            area_id: areaSeleccionada.value.id,
            mes: mesParam
        });

        // Mapear los horarios con cupos disponibles
        horariosDelMes.value = data.map((h: any) => ({
            ...h,
            cupos_disponibles: h.cupos_disponibles ?? h.cupos,
            turno: h.turno || 'M'
        }));
    } catch (error) {
        console.error('Error al cargar horarios', error);
        horariosDelMes.value = [];
    } finally {
        isLoadingHorarios.value = false;
    }
};

const cambiarMes = async (direccion: number) => {
    mesActual.value += direccion;
    if (mesActual.value > 11) {
        mesActual.value = 0;
        añoActual.value++;
    } else if (mesActual.value < 0) {
        mesActual.value = 11
        añoActual.value--;
    }
    diaSeleccionado.value = null;
    horarioSeleccionado.value = null;

    // Recargar horarios para el nuevo mes
    if (medicoSeleccionado.value) {
        isLoadingHorarios.value = true;
        await cargarHorariosDelMes();
    }
};

const seleccionarDia = (dia: DiaCalendario) => {
    diaSeleccionado.value = dia;
    horarioSeleccionado.value = null;
};

const seleccionarHorario = (horario: Horario) => {
    if (horario.cupos_disponibles > 0) {
        horarioSeleccionado.value = horario;
    }
};

const buscarPorDNI = async () => {
    if (!values.dni || values.dni.length !== 8) return;

    isSearching.value = true;
    searchMessage.value = { text: "", type: "success" };

    try {
        const { data } = await pacienteService.buscarPorDNI(values.dni);

        if (data.origen === 'reniec') {
            // Caso B: Encontrado en RENIEC
            setValues({
                ...values,
                nombres: data.nombres,
                apellidoPaterno: data.apellido_paterno,
                apellidoMaterno: data.apellido_materno,
                // Limpiar otros campos para evitar mezcla de datos
                fechaNacimiento: "",
                sexo: "",
                estado_civil: "",
                gradoInstruccion: "",
                religion: "",
                procedencia: "",
                telefono: "",
                email: "",
                direccion: "",
                numeroSis: "",
                tipoSeguro: "",
                sintomas: "",
                ocupacion: "",
                dniAcompanante: "",
                nombreAcompanante: "",
                telefonoAcompanante: "",
            });
            searchMessage.value = {
                text: "Datos obtenidos de RENIEC",
                type: "success",
            };
        } else {
            // Caso A: Paciente ya registrado (Local)
            pacienteId.value = data.id;
            setValues({
                ...values,
                nombres: data.nombres,
                apellidoPaterno: data.apellido_paterno || data.apellidoPaterno,
                apellidoMaterno: data.apellido_materno || data.apellidoMaterno,
                fechaNacimiento: data.fechaNacimiento || data.fecha_nacimiento,
                sexo: data.sexo,
                estado_civil: data.estado_civil,
                gradoInstruccion: data.grado_instruccion ?? "",
                religion: data.religion ?? "",
                procedencia: data.procedencia ?? "",
                telefono: data.telefono ?? "",
                email: data.email ?? "",
                direccion: data.direccion,
                tipoSeguro: data.seguro ?? "",
                numeroSis: data.numero_seguro ?? data.numero_afiliacion ?? "",
                ocupacion: data.ocupacion ?? "",
                // Limpiar datos de cita anterior
                sintomas: "",
                dniAcompanante: "",
                nombreAcompanante: "",
                telefonoAcompanante: "",
            });

            // Abrir secciones relevantes automáticamente
            if (data.seguro) {
                seccionesAbiertas.value.afiliacion = true;
            }
            if (data.grado_instruccion || data.religion || data.procedencia) {
                seccionesAbiertas.value.datosAdicionales = true;
            }

            searchMessage.value = {
                text: "Paciente ya registrado",
                type: "success",
            };
        }
    } catch (error) {
        // Caso C: No encontrado (404)
        console.log(error);
        searchMessage.value = {
            text: "No encontrado en RENIEC. Ingrese los datos manualmente.",
            type: "error", // Usamos error para diferenciar visualmente
        };
        // Opcional: Limpiar campos si se desea
        pacienteId.value = null;
        setValues({
            ...values,
            nombres: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
        });
    } finally {
        isSearching.value = false;
        // Aumentar tiempo de visualización del mensaje
        setTimeout(() => { searchMessage.value = { text: "", type: "success" }; }, 5000);
    }
};

const buscarDniAcompanante = async () => {
    if (!values.dniAcompanante || values.dniAcompanante.length !== 8) return;

    isSearchingAcompanante.value = true;
    try {
        const { data } = await pacienteService.buscarPorDNI(values.dniAcompanante);
        const nombresCompletos = `${data.nombres} ${data.apellido_paterno || data.apellidoPaterno} ${data.apellido_materno || data.apellidoMaterno}`.trim();

        setValues({
            ...values,
            nombreAcompanante: nombresCompletos
        });

        searchMessage.value = {
            text: `Acompañante ${data.origen === 'reniec' ? 'encontrado' : 'registrado'}: ${nombresCompletos}`,
            type: "success",
        };
    } catch (error) {
        console.error("Error al buscar DNI de acompañante:", error);
        searchMessage.value = {
            text: "No se encontró el DNI del acompañante. Ingrese el nombre manualmente.",
            type: "error",
        };
    } finally {
        isSearchingAcompanante.value = false;
        setTimeout(() => { searchMessage.value = { text: "", type: "success" }; }, 5000);
    }
};

const onSubmit = handleSubmit(async (values) => {
    if (!horarioSeleccionado.value || !diaSeleccionado.value) {
        alert("Por favor seleccione una fecha y horario para la cita.");
        return;
    }

    try {
        isSubmitting.value = true;

        // 1. Registrar o actualizar paciente
        const pacientePayload = {
            dni: values.dni,
            nombres: values.nombres,
            apellido_paterno: values.apellidoPaterno,
            apellido_materno: values.apellidoMaterno,
            fecha_nacimiento: values.fechaNacimiento,
            sexo: values.sexo,
            estado_civil: values.estado_civil,
            direccion: values.direccion,
            telefono: values.telefono,
            email: values.email,
            grado_instruccion: values.gradoInstruccion,
            ocupacion: values.ocupacion,
            religion: values.religion,
            procedencia: values.procedencia,
            seguro: values.tipoSeguro,
            numero_seguro: values.numeroSis,
        };

        const { data: pacienteData } = await pacienteService.crearPaciente(pacientePayload);

        console.log('Paciente registrado:', pacienteData);

        // 2. Crear la cita usando el nuevo endpoint
        const citaPayload = {
            paciente_id: pacienteData.id,
            horario_id: horarioSeleccionado.value.id,
            fecha: diaSeleccionado.value.fecha,
            sintomas: values.sintomas,
            area_id: areaSeleccionada.value?.id,
            dni_acompanante: values.dniAcompanante,
            nombre_acompanante: values.nombreAcompanante,
            telefono_acompanante: values.telefonoAcompanante,
        };

        const { data: citaData } = await citaService.crearCita(citaPayload);

        console.log('Cita creada:', citaData);
        console.log('Cupos restantes:', citaData.cupos_restantes);

        // Mostrar mensaje de éxito
        // Mostrar mensaje de éxito con SweetAlert
        await Swal.fire({
            title: '¡Cita Registrada!',
            html: `
                <div class="text-left">
                    <p class="mb-2"><strong>Paciente:</strong> ${pacienteData.data.nombres} ${pacienteData.data.apellido_paterno}</p>
                    <p class="mb-2"><strong>Médico:</strong> ${medicoSeleccionado.value?.name}</p>
                    <p class="mb-2"><strong>Fecha:</strong> ${diaSeleccionado.value.fechaCompleta}</p>
                    <p class="mb-2"><strong>Hora:</strong> ${horarioSeleccionado.value.hora_inicio.slice(0, 5)} - ${horarioSeleccionado.value.hora_fin.slice(0, 5)}</p>
                    <p class="text-emerald-600 font-semibold mt-2">¡Operación exitosa!</p>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#10B981'
        });

        // Limpiar formulario después del registro
        resetForm();



    } catch (error: unknown) {
        console.error('Error:', error);

        // Mostrar error específico del backend
        const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
        const errorMessage = axiosError.response?.data?.error
            || axiosError.response?.data?.message
            || 'Hubo un error al registrar';

        alert(errorMessage);
    } finally {
        isSubmitting.value = false;
    }
}, () => {
    // Callback cuando hay errores de validación
    scrollToFirstError();
});

// Función para convertir a mayúsculas
const toUpperCase = (fieldName: keyof typeof values) => {
    const value = values[fieldName] as string;
    if (typeof value === 'string') {
        setValues({
            ...values,
            [fieldName]: value.toUpperCase()
        });
    }
};

onMounted(() => {
    fetchAreas();
});

const resetForm = () => {
    resetVeeForm();
    areaSeleccionada.value = null;
    medicoSeleccionado.value = null;
    diaSeleccionado.value = null;
    horarioSeleccionado.value = null;
    pacienteId.value = null;
    searchMessage.value = { text: "", type: "success" };
    recomendacion.value = null;

    // Scroll al inicio (sección Buscar Paciente)
    const topElement = document.getElementById('registro-paciente-top');
    if (topElement) {
        topElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
</script>
