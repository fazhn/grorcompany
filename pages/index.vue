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

          <!-- Carrito -->
          <button @click="mostrarCarrito = true"
            class="relative p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 group">
            <svg class="w-6 h-6 text-gray-700 group-hover:text-gray-900" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span v-if="cartCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {{ cartCount }}
            </span>
          </button>
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
        <!-- Ubicación con Google Map -->
        <div class="mb-12">
          <h4 class="font-semibold text-gray-900 mb-4 text-center text-xl">Nuestra Ubicación</h4>
          <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d882.0317825888614!2d-16.557917030417814!3d28.378027998759783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc41cd5866de55cb%3A0xfc5e681692592ddc!2sC.%20Mequinez%2C%2051%2C%2038205%20San%20Crist%C3%B3bal%20de%20La%20Laguna%2C%20Santa%20Cruz%20de%20Tenerife!5e0!3m2!1ses!2ses!4v1733940000000!5m2!1ses!2ses"
              width="100%"
              height="350"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Ubicación de GRORSHOP">
            </iframe>
          </div>
          <p class="text-center text-gray-600 text-sm mt-4 flex items-center justify-center gap-2">
            <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="font-medium">Calle Mequinez, 51, 38205 San Cristóbal de La Laguna, Santa Cruz de Tenerife</span>
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Sección: Información de la tienda -->
          <div class="col-span-1 md:col-span-1">
            <h3 class="text-lg font-bold text-gray-900 mb-4">GRORSHOP</h3>
            <p class="text-gray-500 text-sm">Tu destino para encontrar el estilo que define quién eres. Calidad y diseño
              en cada pieza.</p>
          </div>

          <!-- Sección: Ayuda -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Ayuda</h4>
            <ul class="space-y-2 text-sm text-gray-500">
              <li><a href="#envios" class="hover:text-primary-600 transition-colors">Envíos</a></li>
              <li><a href="#contacto" class="hover:text-primary-600 transition-colors">Contacto</a></li>
            </ul>
          </div>

          <!-- Sección: Envíos -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Envíos</h4>
            <p class="text-gray-500 text-sm leading-relaxed">
              Enviamos a toda Canarias. Consulte las condiciones de envío.
            </p>
          </div>

          <!-- Sección: Contacto y Síguenos -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Contacto</h4>
            <div class="space-y-3 text-sm text-gray-500">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:grorshop2025@gmail.com" class="hover:text-primary-600 transition-colors break-all">
                  grorshop2025@gmail.com
                </a>
              </div>
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <a href="https://wa.me/34614244514" target="_blank" class="hover:text-primary-600 transition-colors">
                  +34 614 244 514
                </a>
              </div>
            </div>

            <div class="mt-6">
              <h4 class="font-semibold text-gray-900 mb-3">Síguenos</h4>
              <div class="flex gap-4">
                <!-- Instagram -->
                <a href="https://www.instagram.com/gror.shop" target="_blank" rel="noopener noreferrer"
                  class="text-gray-400 hover:text-pink-600 transition-colors" title="Instagram">
                  <span class="sr-only">Instagram</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <!-- Facebook -->
                <a href="https://www.facebook.com/share/1AC3M3VioX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
                  class="text-gray-400 hover:text-blue-600 transition-colors" title="Facebook">
                  <span class="sr-only">Facebook</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <!-- TikTok -->
                <a href="https://www.tiktok.com/@gror.shop?_r=1&_t=ZN-928jndUN6jG" target="_blank" rel="noopener noreferrer"
                  class="text-gray-400 hover:text-black transition-colors" title="TikTok">
                  <span class="sr-only">TikTok</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p class="text-gray-400 text-sm">© 2025 GRORSHOP. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <!-- Modal del Carrito -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="mostrarCarrito" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          @click="mostrarCarrito = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div @click.stop
            class="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">Mi Carrito</h2>
                  <p class="text-sm text-gray-500">{{ cartCount }} {{ cartCount === 1 ? 'producto' : 'productos' }}</p>
                </div>
              </div>
              <button @click="mostrarCarrito = false"
                class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Contenido del carrito -->
            <div class="flex-1 overflow-y-auto p-6">
              <div v-if="cart.length === 0" class="text-center py-12">
                <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p class="text-gray-500 text-lg font-medium">Tu carrito está vacío</p>
                <p class="text-gray-400 text-sm mt-1">Agrega productos para comenzar tu pedido</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="item in cart" :key="item.id"
                  class="flex gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                  <!-- Imagen -->
                  <div class="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                    <img :src="item.imagen" :alt="item.titulo" class="w-full h-full object-contain" />
                  </div>

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 text-sm line-clamp-1">{{ item.titulo }}</h3>
                    <p class="text-primary-600 font-bold text-lg mt-1">€{{ Number(item.precio).toFixed(2) }}</p>

                    <!-- Controles de cantidad -->
                    <div class="flex items-center gap-3 mt-2">
                      <div class="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                        <button @click="updateQuantity(item.id, item.cantidad - 1)"
                          :disabled="item.cantidad <= 1"
                          class="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors">
                          <svg class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <span class="px-3 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">{{
                          item.cantidad }}</span>
                        <button @click="updateQuantity(item.id, item.cantidad + 1)"
                          :disabled="item.cantidad >= item.stock"
                          class="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors">
                          <svg class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      <button @click="removeFromCart(item.id)"
                        class="text-red-600 hover:text-red-700 text-sm font-medium">
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <!-- Subtotal -->
                  <div class="text-right flex-shrink-0">
                    <p class="text-gray-500 text-xs">Subtotal</p>
                    <p class="font-bold text-gray-900">€{{ (Number(item.precio) * item.cantidad).toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div v-if="cart.length > 0" class="border-t border-gray-100 p-6 space-y-4">
              <div class="flex items-center justify-between text-lg">
                <span class="font-semibold text-gray-700">Total:</span>
                <span class="text-2xl font-bold text-gray-900">€{{ cartTotal.toFixed(2) }}</span>
              </div>

              <button @click="enviarPorWhatsApp"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-green-600/30">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Enviar Pedido por WhatsApp
              </button>

              <button @click="clearCart"
                class="w-full text-red-600 hover:text-red-700 font-medium py-2 transition-colors text-sm">
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { useCartStore } from '~/stores/cart'
import Toast from 'vue-toastification'
import type { Producto } from '~/stores/products'

// Stores
const productsStore = useProductsStore()
const cartStore = useCartStore()
const toast = Toast.useToast()

// Inicializar datos
onMounted(async () => {
  cartStore.initCart()
  if (productsStore.productos.length === 0) {
    await productsStore.fetchProductos()
  }
})

const mostrarCarrito = ref(false)

// Estados para búsqueda, filtros y paginación
const searchQuery = ref('')
const selectedCategoria = ref('Todas')
const selectedOrden = ref('recientes')
const currentPage = ref(1)
const productsPerPage = 10
const selectedProducto = ref<Producto | null>(null)

// Computed desde stores
const pending = computed(() => productsStore.loading)
const error = computed(() => productsStore.error)
const cartCount = computed(() => cartStore.cartCount)
const cartTotal = computed(() => cartStore.cartTotal)
const cart = computed(() => cartStore.items)

// Obtener categorías únicas de los productos
const categorias = computed(() => {
  const cats = new Set(productsStore.productos.map(p => p.categoria).filter(Boolean))
  return ['Todas', ...Array.from(cats)]
})

// Productos filtrados
const productosFiltrados = computed(() => {
  let filtered = [...productsStore.productos]

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

const contactarWhatsapp = () => {
  if (!selectedProducto.value) return

  const telefono = '34614244514'
  const mensaje = `Hola, estoy interesado en el producto: ${selectedProducto.value.titulo} (€${selectedProducto.value.precio.toFixed(2)})`
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`

  window.open(url, '_blank')
}

// Funciones del carrito
const removeFromCart = (productId: number) => {
  cartStore.removeFromCart(productId)
}

const updateQuantity = (productId: number, cantidad: number) => {
  cartStore.updateQuantity(productId, cantidad)
}

const clearCart = () => {
  cartStore.clearCart()
  toast.info('Carrito vaciado')
}

// Enviar carrito por WhatsApp
const enviarPorWhatsApp = () => {
  const telefono = '34614244514'
  const mensaje = cartStore.generateWhatsAppMessage()
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`

  window.open(url, '_blank')
  mostrarCarrito.value = false
}
</script>
