<template>
  <div class="min-h-screen bg-[#fcf3e2]">
    <!-- Header -->
    <header class="border-b border-gray-700/30 backdrop-blur-xl bg-[#fcf3e2]/80 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <!-- Logo y título -->
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              <img src="/images/logo.jpeg" alt="GRORSHOP Logo" class="w-full h-full object-cover" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight">GRORSHOP</h1>
            </div>
          </div>

          <!-- Buscador -->
          <div class="hidden md:block flex-1 max-w-md">
            <div class="relative group">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar productos (Stitch...)"
                class="w-full bg-white/60 text-gray-900 placeholder-gray-600 px-4 py-3 pl-12 rounded-xl border border-gray-400/50 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 backdrop-blur-sm"
              />
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-orange-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Título y filtros -->
      <div class="flex items-center justify-between mb-12">
        <div>
          <h2 class="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Catálogo</h2>
          <p class="text-gray-700 text-lg">Mostrando <span class="text-orange-600 font-semibold">{{ productosFiltrados.length }}</span> productos</p>
        </div>

        <div class="flex gap-3">
          <select v-model="selectedCategoria" class="bg-white/60 text-gray-900 px-5 py-2.5 rounded-xl border border-gray-400/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 backdrop-blur-sm cursor-pointer hover:bg-white/80">
            <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="selectedOrden" class="bg-white/60 text-gray-900 px-5 py-2.5 rounded-xl border border-gray-400/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 backdrop-blur-sm cursor-pointer hover:bg-white/80">
            <option value="recientes">Más recientes</option>
            <option value="menor-precio">Menor precio</option>
            <option value="mayor-precio">Mayor precio</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-24">
        <div class="inline-block w-16 h-16 border-4 border-gray-400/30 border-t-orange-600 rounded-full animate-spin shadow-lg shadow-orange-500/20"></div>
        <p class="mt-6 text-gray-700 text-lg">Cargando productos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-24">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-red-700 text-lg font-medium">Error al cargar productos</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="productosFiltrados.length === 0" class="text-center py-24">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white/60 rounded-2xl mb-6 border border-gray-400/50">
          <svg class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p class="text-gray-800 text-xl mb-2 font-medium">No se encontraron productos</p>
        <p class="text-gray-600 mb-6">Intenta con otros filtros o términos de búsqueda</p>
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductoCard
            v-for="producto in productosPaginados"
            :key="producto.id"
            :producto="producto"
            @ver="verProducto(producto)"
          />
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="mt-12 flex items-center justify-center gap-2">
          <button
            @click="paginaAnterior"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-white/60 hover:bg-white/80 disabled:opacity-30 disabled:cursor-not-allowed text-gray-900 rounded-lg transition-all duration-300 border border-gray-400/50"
          >
            ← Anterior
          </button>

          <div class="flex gap-2">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="irAPagina(page)"
              :class="[
                'px-4 py-2 rounded-lg transition-all duration-300',
                currentPage === page
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/60 hover:bg-white/80 text-gray-900 border border-gray-400/50'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="paginaSiguiente"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-white/60 hover:bg-white/80 disabled:opacity-30 disabled:cursor-not-allowed text-gray-900 rounded-lg transition-all duration-300 border border-gray-400/50"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Producto -->
    <div v-if="selectedProducto" @click="cerrarModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div @click.stop class="bg-white/95 border border-gray-400/50 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-auto backdrop-blur-xl shadow-2xl">
        <div class="flex items-start justify-between mb-6">
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">{{ selectedProducto.titulo }}</h2>
          <button @click="cerrarModal" class="text-gray-600 hover:text-gray-900 transition-colors">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Imagen -->
          <div class="rounded-2xl overflow-hidden bg-gray-100/80 aspect-square border border-gray-300/50">
            <img
              v-if="selectedProducto.imagen"
              :src="selectedProducto.imagen"
              :alt="selectedProducto.titulo"
              class="w-full h-full object-contain"
            />
            <div v-else class="flex items-center justify-center h-full">
              <svg class="w-24 h-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Detalles -->
          <div class="space-y-6">
            <div>
              <p class="text-gray-600 text-sm mb-1">Categoría</p>
              <p class="text-gray-900 text-lg font-medium">{{ selectedProducto.categoria || 'Sin categoría' }}</p>
            </div>

            <div v-if="selectedProducto.descripcion">
              <p class="text-gray-600 text-sm mb-1">Descripción</p>
              <p class="text-gray-900 text-lg">{{ selectedProducto.descripcion }}</p>
            </div>

            <div v-if="selectedProducto.colores && selectedProducto.colores.length > 0">
              <p class="text-gray-600 text-sm mb-2">Variantes</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(color, index) in selectedProducto.colores"
                  :key="index"
                  class="px-3 py-1.5 bg-yellow-400 text-gray-900 rounded-lg text-sm font-semibold"
                >
                  {{ color }}
                </span>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-300/50">
              <p class="text-gray-600 text-sm mb-2">Precio</p>
              <p class="text-red-600 font-bold text-4xl">€{{ selectedProducto.precio.toFixed(2) }}</p>
            </div>

            <button class="w-full px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02]">
              Contactar para comprar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-20 border-t border-gray-700/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p class="text-center text-gray-700 text-sm">
          © 2025 GRORSHOP. Todos los derechos reservados.
        </p>
      </div>
    </footer>
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

const { data: productos, pending, error } = await useFetch<Producto[]>('/api/productos')

// Parsear colores JSON
if (productos.value) {
  productos.value = productos.value.map(p => ({
    ...p,
    colores: typeof p.colores === 'string' ? JSON.parse(p.colores) : p.colores
  }))
}

// Estados para búsqueda, filtros y paginación
const searchQuery = ref('')
const selectedCategoria = ref('Todas')
const selectedOrden = ref('recientes')
const currentPage = ref(1)
const productsPerPage = 10
const selectedProducto = ref<Producto | null>(null)

// Obtener categorías únicas de los productos
const categorias = computed(() => {
  if (!productos.value) return ['Todas']
  const cats = new Set(productos.value.map(p => p.categoria).filter(Boolean))
  return ['Todas', ...Array.from(cats)]
})

// Productos filtrados
const productosFiltrados = computed(() => {
  if (!productos.value) return []

  let filtered = [...productos.value]

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.titulo.toLowerCase().includes(query) ||
      p.descripcion?.toLowerCase().includes(query) ||
      p.categoria?.toLowerCase().includes(query)
    )
  }

  // Filtrar por categoría
  if (selectedCategoria.value !== 'Todas') {
    filtered = filtered.filter(p => p.categoria === selectedCategoria.value)
  }

  // Ordenar
  if (selectedOrden.value === 'menor-precio') {
    filtered.sort((a, b) => a.precio - b.precio)
  } else if (selectedOrden.value === 'mayor-precio') {
    filtered.sort((a, b) => b.precio - a.precio)
  } else {
    // Por defecto: más recientes (por ID descendente)
    filtered.sort((a, b) => b.id - a.id)
  }

  return filtered
})

// Productos paginados
const productosPaginados = computed(() => {
  const start = (currentPage.value - 1) * productsPerPage
  const end = start + productsPerPage
  return productosFiltrados.value.slice(start, end)
})

// Total de páginas
const totalPages = computed(() => {
  return Math.ceil(productosFiltrados.value.length / productsPerPage)
})

// Resetear a página 1 cuando cambian los filtros
watch([searchQuery, selectedCategoria, selectedOrden], () => {
  currentPage.value = 1
})

// Funciones para paginación
const irAPagina = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const paginaAnterior = () => {
  if (currentPage.value > 1) {
    irAPagina(currentPage.value - 1)
  }
}

const paginaSiguiente = () => {
  if (currentPage.value < totalPages.value) {
    irAPagina(currentPage.value + 1)
  }
}

// Función para abrir modal de producto
const verProducto = (producto: Producto) => {
  selectedProducto.value = producto
}

const cerrarModal = () => {
  selectedProducto.value = null
}
</script>
