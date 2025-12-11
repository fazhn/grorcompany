<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white border border-gray-100 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md">
        <div class="text-center mb-10">
          <div
            class="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6 shadow-md transition-all duration-300 hover:scale-105">
            <img src="/images/logo.jpeg" alt="GRORSHOP Logo" class="w-full h-full object-cover" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Panel de Administración</h1>
          <p class="text-gray-500 text-sm">Gestiona tu catálogo de productos</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2.5">Usuario</label>
            <input id="username" v-model="loginForm.username" type="text" required placeholder="admin"
              class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300" />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2.5">Contraseña</label>
            <input id="password" v-model="loginForm.password" type="password" required placeholder="••••••••"
              class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300" />
          </div>

          <button type="submit"
            class="w-full px-4 py-3.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 hover:-translate-y-0.5 mt-6">
            Iniciar Sesión
          </button>

          <p v-if="loginError"
            class="text-red-600 text-center text-sm mt-4 bg-red-50 px-4 py-2.5 rounded-lg border border-red-100 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ loginError }}
          </p>
        </form>
      </div>
    </div>

    <!-- Admin Panel -->
    <div v-else>
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                <img src="/images/logo.jpeg" alt="GRORSHOP Logo" class="w-full h-full object-cover" />
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 tracking-tight">Panel de Administración</h1>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- Modo Mantenimiento Toggle -->
              <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <label class="flex items-center gap-2 cursor-pointer">
                  <span class="text-sm font-medium text-gray-700">Modo Mantenimiento</span>
                  <div class="relative">
                    <input
                      type="checkbox"
                      v-model="maintenanceMode"
                      @change="toggleMaintenance"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </div>
                  <span v-if="maintenanceMode" class="text-xs font-semibold text-orange-600">ACTIVO</span>
                  <span v-else class="text-xs font-semibold text-gray-500">INACTIVO</span>
                </label>
              </div>

              <NuxtLink to="/"
                class="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all duration-300 border border-gray-200">
                Ver Catálogo
              </NuxtLink>
              <button @click="handleLogout"
                class="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-all duration-300 border border-red-100">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Tabs -->
        <div class="flex flex-wrap items-center gap-4 mb-8">
          <button @click="activeTab = 'crear'" :class="[
            'px-6 py-3 rounded-xl font-semibold transition-all duration-300 border',
            activeTab === 'crear'
              ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20'
              : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
          ]">
            {{ editingProductId && activeTab === 'crear' ? 'Editando Producto' : 'Crear Producto' }}
          </button>
          <button @click="activeTab = 'gestionar'" :class="[
            'px-6 py-3 rounded-xl font-semibold transition-all duration-300 border',
            activeTab === 'gestionar'
              ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20'
              : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
          ]">
            Gestionar Productos
          </button>

          <!-- Botón nuevo producto cuando estás editando -->
          <button
            v-if="editingProductId && activeTab === 'crear'"
            @click="resetForm"
            class="ml-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 border border-primary-600 shadow-lg shadow-primary-600/20 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </button>
        </div>

        <!-- Tab: Crear Producto -->
        <div v-if="activeTab === 'crear'"
          class="bg-white border border-gray-100 rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 tracking-tight">
                {{ editingProductId ? 'Editar Producto' : 'Agregar Nuevo Producto' }}
              </h2>
              <button
                v-if="editingProductId"
                @click="cancelEdit"
                class="text-sm text-gray-500 hover:text-gray-700 mt-1 flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancelar edición
              </button>
            </div>
            <div class="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
              <svg v-if="!editingProductId" class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <svg v-else class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Título -->
            <div>
              <label for="titulo" class="block text-sm font-semibold text-gray-700 mb-2">Título del Producto *</label>
              <input id="titulo" v-model="form.titulo" type="text" required placeholder="Ej: Mochila Infantil Stitch"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300" />
            </div>

            <!-- Descripción -->
            <div>
              <label for="descripcion" class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
              <textarea id="descripcion" v-model="form.descripcion" rows="3" placeholder="Ej: Disney, Escolar, Viaje..."
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none transition-all duration-300"></textarea>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <!-- Categoría -->
              <div>
                <label for="categoria" class="block text-sm font-semibold text-gray-700 mb-2">Categoría *</label>
                <div class="relative">
                  <select id="categoria" v-model="form.categoria" required
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 appearance-none cursor-pointer">
                    <option value="" disabled>Selecciona una categoría</option>
                    <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                  <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <!-- Precio -->
              <div>
                <label for="precio" class="block text-sm font-semibold text-gray-700 mb-2">Precio (€) *</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">€</span>
                  <input id="precio" v-model.number="form.precio" type="number" step="0.01" min="0" required
                    placeholder="0.00"
                    class="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 font-medium" />
                </div>
              </div>
            </div>

            <!-- Imagen -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Imagen del Producto</label>

              <!-- Vista previa cuando hay imagen -->
              <div v-if="imagePreview" class="space-y-3">
                <div class="relative w-full max-w-xs">
                  <div class="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md">
                    <img :src="imagePreview" alt="Preview" class="w-full h-48 object-cover" />
                  </div>
                  <button
                    type="button"
                    @click="removeImage"
                    class="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                    title="Eliminar imagen"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-gray-500 flex items-center gap-1">
                  <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Imagen cargada correctamente
                </p>
              </div>

              <!-- Área de carga cuando no hay imagen -->
              <div v-else>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  class="hidden"
                />
                <label
                  for="file-upload"
                  class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 transition-all duration-300 hover:bg-gray-100 hover:border-primary-500 cursor-pointer group"
                >
                  <svg class="w-12 h-12 text-gray-400 mb-3 group-hover:text-primary-500 transition-colors" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Click para subir una imagen</p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG o WEBP</p>
                </label>
              </div>
            </div>

            <!-- Colores/Variantes -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Variantes / Badges</label>
              <div class="flex gap-3">
                <input v-model="colorInput" type="text" placeholder="Ej: Disney, Premium..."
                  @keypress.enter.prevent="agregarColor"
                  class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300" />
                <button type="button" @click="agregarColor"
                  class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-300">
                  +
                </button>
              </div>
              <div v-if="form.colores.length > 0"
                class="flex flex-wrap gap-2 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span v-for="(color, index) in form.colores" :key="index"
                  class="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm">
                  {{ color }}
                  <button type="button" @click="eliminarColor(index)"
                    class="p-0.5 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex gap-4 pt-6 border-t border-gray-100">
              <button type="submit" :disabled="isSubmitting"
                class="flex-1 px-6 py-4 bg-gray-900 hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-0.5">
                {{ isSubmitting ? (editingProductId ? 'Actualizando...' : 'Guardando...') : (editingProductId ? 'Actualizar Producto' : 'Guardar Producto') }}
              </button>
              <button type="button" @click="cancelEdit"
                class="px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                {{ editingProductId ? 'Cancelar' : 'Limpiar' }}
              </button>
            </div>

            <!-- Mensaje de estado -->
            <Transition enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-200 ease-in" leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0">
              <div v-if="submitMessage" :class="[
                'px-6 py-4 rounded-xl font-medium flex items-center gap-3',
                submitStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              ]">
                <div
                  :class="['w-6 h-6 rounded-full flex items-center justify-center shrink-0', submitStatus === 'success' ? 'bg-green-100' : 'bg-red-100']">
                  <svg v-if="submitStatus === 'success'" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                {{ submitMessage }}
              </div>
            </Transition>
          </form>
        </div>

        <!-- Tab: Gestionar Productos -->
        <div v-else-if="activeTab === 'gestionar'" class="space-y-6">
          <!-- Loading -->
          <div v-if="loadingProductos" class="text-center py-12">
            <div class="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin">
            </div>
            <p class="text-gray-500 mt-4">Cargando productos...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!productos || productos.length === 0"
            class="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm">
            <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No hay productos</h3>
            <p class="text-gray-500">Agrega tu primer producto para comenzar</p>
          </div>

          <!-- Products List -->
          <div v-else class="grid grid-cols-1 gap-4">
            <div v-for="producto in productos" :key="producto.id"
              class="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 sm:gap-6 hover:shadow-lg transition-all duration-300 group">
              <!-- Imagen -->
              <div
                class="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                <img v-if="producto.imagen" :src="producto.imagen" :alt="producto.titulo"
                  class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0 py-1">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1 leading-tight">{{ producto.titulo }}</h3>
                    <p class="text-sm text-gray-500 line-clamp-1 mb-2">{{ producto.descripcion }}</p>
                    <div class="flex items-center gap-3">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {{ producto.categoria || 'Sin categoría' }}
                      </span>
                      <span class="text-lg font-bold text-gray-900">€{{ formatPrecio(producto.precio) }}</span>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button @click="editarProducto(producto)"
                      class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Editar producto">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="eliminarProducto(producto.id)" :disabled="deletingId === producto.id"
                      class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group/delete"
                      title="Eliminar producto">
                      <svg v-if="deletingId !== producto.id" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span v-else
                        class="inline-block w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Producto {
  id: number
  titulo: string
  descripcion: string
  categoria: string
  imagen: string
  colores: string[]
  precio: number
}

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '951UcqoNY'
}

const isAuthenticated = ref(false)
const loginForm = ref({ username: '', password: '' })
const loginError = ref('')

// Maintenance mode
const maintenanceMode = ref(false)

// Tab management
const activeTab = ref<'crear' | 'gestionar'>('crear')

// Products management
const productos = ref<Producto[]>([])
const loadingProductos = ref(false)
const deletingId = ref<number | null>(null)
const editingProductId = ref<number | null>(null)

const form = ref({
  titulo: '',
  descripcion: '',
  categoria: '',
  imagen: '',
  colores: [] as string[],
  precio: 0
})

const categorias = [
  'Mochilas',
  'Accesorios',
  'Loncheras',
  'Cartucheras',
  'Peluches',
  'Juguetes',
  'Otro'
]

const colorInput = ref('')
const imagePreview = ref('')
const selectedFile = ref<File | null>(null)
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitStatus = ref<'success' | 'error'>('success')

const handleLogin = () => {
  if (loginForm.value.username === ADMIN_CREDENTIALS.username && loginForm.value.password === ADMIN_CREDENTIALS.password) {
    isAuthenticated.value = true
    loginError.value = ''
  } else {
    loginError.value = 'Usuario o contraseña incorrectos'
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  loginForm.value = { username: '', password: '' }
  resetForm()
}

// Funciones de modo mantenimiento
const loadMaintenanceStatus = async () => {
  try {
    const data = await $fetch<{ maintenanceMode: boolean }>('/api/settings/maintenance')
    maintenanceMode.value = data.maintenanceMode
  } catch (error) {
    console.error('Error al cargar estado de mantenimiento:', error)
  }
}

const toggleMaintenance = async () => {
  try {
    await $fetch('/api/settings/maintenance', {
      method: 'POST',
      body: {
        enabled: maintenanceMode.value
      }
    })

    submitMessage.value = maintenanceMode.value
      ? '⚠️ Modo mantenimiento ACTIVADO'
      : '✓ Modo mantenimiento DESACTIVADO'
    submitStatus.value = maintenanceMode.value ? 'error' : 'success'

    setTimeout(() => {
      submitMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error al cambiar modo mantenimiento:', error)
    // Revertir el toggle si falla
    maintenanceMode.value = !maintenanceMode.value

    submitMessage.value = '✗ Error al cambiar modo mantenimiento'
    submitStatus.value = 'error'

    setTimeout(() => {
      submitMessage.value = ''
    }, 3000)
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imagePreview.value = ''
  selectedFile.value = null

  // Reset file input
  const fileInput = document.getElementById('file-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const agregarColor = () => {
  if (colorInput.value.trim()) {
    form.value.colores.push(colorInput.value.trim())
    colorInput.value = ''
  }
}

const eliminarColor = (index: number) => {
  form.value.colores.splice(index, 1)
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitMessage.value = ''

  try {
    let imagePath = form.value.imagen // Mantener imagen actual por defecto

    // Si hay un nuevo archivo seleccionado, subirlo
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('file', selectedFile.value)
      const uploadResponse = await $fetch<{ filename: string }>('/api/upload', {
        method: 'POST',
        body: formData
      })
      imagePath = uploadResponse.filename
    }

    if (editingProductId.value) {
      // Actualizar producto existente
      await $fetch(`/api/productos/${editingProductId.value}`, {
        method: 'PUT',
        body: {
          titulo: form.value.titulo,
          descripcion: form.value.descripcion,
          categoria: form.value.categoria,
          imagen: imagePath,
          colores: form.value.colores,
          precio: form.value.precio
        }
      })

      submitMessage.value = '✓ Producto actualizado exitosamente'
      submitStatus.value = 'success'
    } else {
      // Crear nuevo producto
      await $fetch('/api/productos', {
        method: 'POST',
        body: {
          titulo: form.value.titulo,
          descripcion: form.value.descripcion,
          categoria: form.value.categoria,
          imagen: imagePath,
          colores: form.value.colores,
          precio: form.value.precio
        }
      })

      submitMessage.value = '✓ Producto creado exitosamente'
      submitStatus.value = 'success'
    }

    resetForm()
    cargarProductos()

    setTimeout(() => {
      submitMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error al guardar producto:', error)
    submitMessage.value = editingProductId.value ? '✗ Error al actualizar el producto' : '✗ Error al crear el producto'
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    titulo: '',
    descripcion: '',
    categoria: '',
    imagen: '',
    colores: [],
    precio: 0
  }
  colorInput.value = ''
  imagePreview.value = ''
  selectedFile.value = null
  editingProductId.value = null

  // Reset file input
  const fileInput = document.getElementById('file-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// Función para editar producto
const editarProducto = (producto: Producto) => {
  form.value = {
    titulo: producto.titulo,
    descripcion: producto.descripcion,
    categoria: producto.categoria,
    imagen: producto.imagen,
    colores: producto.colores || [],
    precio: producto.precio
  }
  editingProductId.value = producto.id
  imagePreview.value = producto.imagen
  selectedFile.value = null
  activeTab.value = 'crear'

  // Scroll al top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Función para cancelar edición
const cancelEdit = () => {
  if (editingProductId.value && !confirm('¿Descartar los cambios?')) {
    return
  }
  resetForm()
}

// Cargar productos
const cargarProductos = async () => {
  loadingProductos.value = true
  try {
    const data = await $fetch<any[]>('/api/productos')
    productos.value = data.map(p => ({
      ...p,
      colores: typeof p.colores === 'string' ? JSON.parse(p.colores) : p.colores
    }))
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    loadingProductos.value = false
  }
}

// Eliminar producto
const eliminarProducto = async (id: number) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
    return
  }

  deletingId.value = id
  try {
    await $fetch(`/api/productos/${id}`, {
      method: 'DELETE'
    })

    // Remover de la lista local
    productos.value = productos.value.filter(p => p.id !== id)

    // Mostrar mensaje de éxito
    submitMessage.value = '✓ Producto eliminado exitosamente'
    submitStatus.value = 'success'

    setTimeout(() => {
      submitMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    submitMessage.value = '✗ Error al eliminar el producto'
    submitStatus.value = 'error'

    setTimeout(() => {
      submitMessage.value = ''
    }, 3000)
  } finally {
    deletingId.value = null
  }
}

// Formato de precio
const formatPrecio = (precio: any) => {
  if (!precio) return '0.00'
  const precioNum = typeof precio === 'string' ? parseFloat(precio) : Number(precio)
  if (isNaN(precioNum)) return '0.00'
  return precioNum.toFixed(2)
}

onMounted(() => {
  if (process.client) {
    const auth = localStorage.getItem('admin_auth')
    if (auth === 'true') {
      isAuthenticated.value = true
      cargarProductos()
      loadMaintenanceStatus()
    }
  }
})

watch(isAuthenticated, (newVal) => {
  if (process.client) {
    if (newVal) {
      localStorage.setItem('admin_auth', 'true')
      cargarProductos()
      loadMaintenanceStatus()
    } else {
      localStorage.removeItem('admin_auth')
    }
  }
})

// Recargar productos cuando se cambia al tab de gestionar
watch(activeTab, (newTab) => {
  if (newTab === 'gestionar') {
    cargarProductos()
    // Limpiar el estado de edición si existe
    if (editingProductId.value) {
      resetForm()
    }
  }
})
</script>
