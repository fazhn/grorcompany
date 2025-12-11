<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header
      class="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between gap-8">
          <!-- Logo -->
          <div class="flex items-center gap-3 cursor-pointer group"
            @click="window.scrollTo({ top: 0, behavior: 'smooth' })">
            <div
              class="w-10 h-10 rounded-xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
              <img src="/images/logo.jpeg" alt="GRORSHOP Logo" class="w-full h-full object-cover" />
            </div>
            <h1 class="text-xl font-bold text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">
              GRORSHOP</h1>
          </div>

          <!-- Buscador Central -->
          <div class="hidden md:block flex-1 max-w-lg">
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input v-model="searchQuery" type="text" placeholder="Buscar productos..."
                class="block w-full pl-11 pr-4 py-2.5 bg-gray-100 border-none rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all duration-300" />
            </div>
          </div>

          <!-- Acciones Derecha (Eliminado) -->
          <div class="hidden"></div>
        </div>
      </div>
    </header>

    <!-- Espaciador para el header fijo -->
    <div class="h-20"></div>

    <!-- Main Content -->
    <div id="catalogo" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 scroll-mt-24">
      <!-- Filtros Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight mb-2">Catálogo</h2>
          <p class="text-gray-500">Explora <span class="text-gray-900 font-medium">{{ productosFiltrados.length
              }}</span> productos exclusivos</p>
        </div>

        <div class="flex flex-wrap gap-3">
          <select v-model="selectedCategoria"
            class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all cursor-pointer shadow-sm hover:border-gray-300">
            <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
          </select>

          <select v-model="selectedOrden"
            class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all cursor-pointer shadow-sm hover:border-gray-300">
            <option value="recientes">Más recientes</option>
            <option value="menor-precio">Menor precio</option>
            <option value="mayor-precio">Mayor precio</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-32">
        <div class="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500 animate-pulse">Cargando colección...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-32">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Algo salió mal</h3>
        <p class="text-gray-500">No pudimos cargar los productos. Por favor, intenta de nuevo.</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="productosFiltrados.length === 0" class="text-center py-32">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
        <p class="text-gray-500 max-w-md mx-auto">Intenta ajustar tus filtros o búsqueda para encontrar lo que
          necesitas.</p>
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
          <ProductoCard v-for="producto in productosPaginados" :key="producto.id" :producto="producto"
            @ver="verProducto" />
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="mt-16 flex items-center justify-center gap-2">
          <button @click="paginaAnterior" :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            ←
          </button>

          <button v-for="page in totalPages" :key="page" @click="irAPagina(page)" :class="[
            'w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
            currentPage === page
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          ]">
            {{ page }}
          </button>

          <button @click="paginaSiguiente" :disabled="currentPage === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            →
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Producto -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="selectedProducto" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title"
        role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true"
            @click="cerrarModal"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div
            class="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div class="absolute top-0 right-0 pt-4 pr-4 z-10">
              <button @click="cerrarModal"
                class="bg-white rounded-full p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm">
                <span class="sr-only">Cerrar</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="grid md:grid-cols-2 gap-0 bg-white">
              <!-- Imagen -->
              <div class="relative h-[400px] md:h-full bg-gray-50 flex items-center justify-center p-8">
                <img v-if="selectedProducto.imagen" :src="selectedProducto.imagen" :alt="selectedProducto.titulo"
                  class="max-w-full max-h-full object-contain filter drop-shadow-xl" />
              </div>

              <!-- Contenido -->
              <div class="p-8 md:p-12 flex flex-col h-full">
                <div class="mb-auto">
                  <div class="flex items-center gap-2 mb-4">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {{ selectedProducto.categoria || 'Colección' }}
                    </span>
                  </div>

                  <h3 class="text-3xl font-bold text-gray-900 mb-4">{{ selectedProducto.titulo }}</h3>

                  <p class="text-gray-600 text-lg leading-relaxed mb-6">
                    {{ selectedProducto.descripcion }}
                  </p>

                  <div v-if="selectedProducto.colores && selectedProducto.colores.length > 0" class="mb-8">
                    <h4 class="text-sm font-medium text-gray-900 mb-3">Colores disponibles</h4>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="(color, index) in selectedProducto.colores" :key="index"
                        class="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        {{ color }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="pt-8 border-t border-gray-100 mt-8">
                  <div class="flex items-center justify-between mb-6">
                    <span class="text-gray-500">Precio total</span>
                    <span class="text-4xl font-extrabold text-gray-900">€{{ selectedProducto.precio.toFixed(2) }}</span>
                  </div>

                  <button @click="contactarWhatsapp"
                    class="w-full bg-gray-900 text-white rounded-xl px-4 py-4 text-base font-bold shadow-lg shadow-gray-900/20 hover:bg-black hover:transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contactar para comprar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-1">
            <h3 class="text-lg font-bold text-gray-900 mb-4">GRORSHOP</h3>
            <p class="text-gray-500 text-sm">Tu destino para encontrar el estilo que define quién eres. Calidad y diseño
              en cada pieza.</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Enlaces Rápidos</h4>
            <ul class="space-y-2 text-sm text-gray-500">
              <li><a href="#" class="hover:text-primary-600 transition-colors">Inicio</a></li>
              <li><a href="#" class="hover:text-primary-600 transition-colors">Catálogo</a></li>
              <li><a href="#" class="hover:text-primary-600 transition-colors">Nosotros</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Ayuda</h4>
            <ul class="space-y-2 text-sm text-gray-500">
              <li><a href="#" class="hover:text-primary-600 transition-colors">Envíos</a></li>
              <li><a href="#" class="hover:text-primary-600 transition-colors">Devoluciones</a></li>
              <li><a href="#" class="hover:text-primary-600 transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Síguenos</h4>
            <div class="flex gap-4">
              <!-- Social Icons -->
              <a href="#" class="text-gray-400 hover:text-primary-600 transition-colors">
                <span class="sr-only">Instagram</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.315 2zm-3.196 3.237c-1.927.085-2.924.536-3.525 1.14-.615.613-1.042 1.583-1.129 3.518-.086 1.93-.086 5.285 0 7.215.087 1.934.502 2.91 1.129 3.518.601.604 1.597 1.055 3.525 1.14 1.93.085 5.284.085 7.215 0 1.928-.085 2.923-.536 3.525-1.14.604-.602 1.055-1.598 1.14-3.518.085-1.93.085-5.284 0-7.215-.085-1.928-.536-2.923-1.14-3.525-.602-.604-1.598-1.055-3.525-1.14-1.93-.085-5.284-.085-7.215 0zm6.918 3.036a1.185 1.185 0 110 2.37 1.185 1.185 0 010-2.37zm-3.722 1.298a4.116 4.116 0 110 8.232 4.116 4.116 0 010-8.232zm0 1.895a2.221 2.221 0 100 4.442 2.221 2.221 0 000-4.442z"
                    clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p class="text-gray-400 text-sm">© 2025 GRORSHOP. Todos los derechos reservados.</p>
        </div>
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
  console.log('Abriendo producto:', producto)
  selectedProducto.value = producto
}

const cerrarModal = () => {
  selectedProducto.value = null
}

const contactarWhatsapp = () => {
  if (!selectedProducto.value) return

  const telefono = '521234567890' // Reemplaza con el número real
  const mensaje = `Hola, estoy interesado en el producto: ${selectedProducto.value.titulo} (€${selectedProducto.value.precio.toFixed(2)})`
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`

  window.open(url, '_blank')
}
</script>
