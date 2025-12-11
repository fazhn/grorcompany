<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between gap-8">
          <!-- Logo y botón volver -->
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="flex items-center gap-3 cursor-pointer group">
              <div
                class="w-10 h-10 rounded-xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105">
                <img src="/images/logo.jpeg" alt="GRORSHOP Logo" class="w-full h-full object-cover" />
              </div>
              <h1 class="text-xl font-bold text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">
                GRORSHOP
              </h1>
            </NuxtLink>
          </div>

          <div class="flex items-center gap-3">
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

            <NuxtLink to="/"
              class="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all duration-300 border border-gray-200 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Catálogo
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="pending" class="flex flex-col items-center justify-center py-32">
      <div class="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 animate-pulse">Cargando producto...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !producto" class="max-w-3xl mx-auto px-4 py-32 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
        <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Producto no encontrado</h3>
      <p class="text-gray-500 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
      <NuxtLink to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al Catálogo
      </NuxtLink>
    </div>

    <!-- Product Details -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div class="grid md:grid-cols-2 gap-0">
          <!-- Imagen del producto -->
          <div class="relative bg-gray-50 flex items-center justify-center p-4 md:p-6 min-h-[400px] md:min-h-[600px]">
            <img v-if="producto.imagen" :src="producto.imagen" :alt="producto.titulo"
              class="max-w-full max-h-full object-contain filter drop-shadow-2xl" />
            <div v-else class="flex items-center justify-center">
              <svg class="w-32 h-32 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- Badge NUEVO (izquierda) -->
            <span v-if="producto.es_nuevo"
              class="absolute top-4 md:top-6 left-4 md:left-6 z-10 bg-white/95 backdrop-blur-md text-gray-900 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-sm border border-gray-100 flex items-center gap-2 ring-1 ring-black/5 uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              NUEVO
            </span>

            <!-- Badge DESCUENTO (derecha) -->
            <span v-if="producto.descuento && producto.descuento > 0"
              class="absolute top-4 md:top-6 right-4 md:right-6 z-10 bg-rose-600 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-xl shadow-rose-600/30 border border-rose-500/20 flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              -{{ producto.descuento }}%
            </span>
          </div>

          <!-- Información del producto -->
          <div class="p-8 md:p-12 flex flex-col">
            <div class="mb-auto">
              <!-- Categoría -->
              <div class="flex items-center gap-2 mb-6">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {{ producto.categoria || 'Producto' }}
                </span>
              </div>

              <!-- Título -->
              <h1 class="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {{ producto.titulo }}
              </h1>

              <!-- Descripción -->
              <p class="text-gray-600 text-lg leading-relaxed mb-8">
                {{ producto.descripcion || 'Sin descripción disponible' }}
              </p>

              <!-- Colores disponibles -->
              <div v-if="producto.colores && producto.colores.length > 0" class="mb-8">
                <h4 class="text-sm font-semibold text-gray-900 mb-4">Variantes disponibles</h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(color, index) in producto.colores" :key="index"
                    class="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                    {{ color }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Precio y botón de compra -->
            <div class="pt-8 border-t border-gray-100 mt-8">
              <div class="flex items-baseline justify-between mb-6">
                <div>
                  <span class="text-gray-500 text-sm block mb-2">Precio</span>
                  <div v-if="producto.descuento && producto.descuento > 0" class="flex items-center gap-4">
                    <span class="text-5xl font-extrabold text-red-600">€{{ formatPrecio(producto.precio) }}</span>
                    <span class="text-2xl text-gray-400 line-through">€{{ formatPrecio(producto.precio_original)
                    }}</span>
                  </div>
                  <span v-else class="text-5xl font-extrabold text-gray-900">€{{ formatPrecio(producto.precio) }}</span>
                  <p v-if="producto.descuento && producto.descuento > 0"
                    class="text-sm text-green-600 font-semibold mt-2">
                    ¡Ahorra €{{ formatPrecio((producto.precio_original || 0) - producto.precio) }}!
                  </p>
                </div>
              </div>

              <!-- Stock status -->
              <div class="mb-6">
                <div v-if="producto.stock === 0"
                  class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <p class="text-red-900 font-bold text-sm">Producto agotado</p>
                    <p class="text-red-700 text-xs mt-0.5">Contacta para consultar disponibilidad</p>
                  </div>
                </div>
                <div v-else-if="producto.stock && producto.stock < 5"
                  class="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <svg class="w-5 h-5 text-orange-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <p class="text-orange-900 font-bold text-sm">¡Pocas unidades disponibles!</p>
                    <p class="text-orange-700 text-xs mt-0.5">Solo quedan {{ producto.stock }} unidades</p>
                  </div>
                </div>
                <div v-else-if="producto.stock && producto.stock > 0"
                  class="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <p class="text-green-900 font-bold text-sm">En stock</p>
                    <p class="text-green-700 text-xs mt-0.5">Disponible para entrega inmediata</p>
                  </div>
                </div>
              </div>

              <!-- Selector de cantidad y agregar al carrito -->
              <div v-if="producto.stock && producto.stock > 0" class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-3">Cantidad</label>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-3 bg-gray-50 rounded-xl border-2 border-gray-200 p-1">
                    <button @click="cantidad = Math.max(1, cantidad - 1)"
                      class="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="px-6 text-xl font-bold text-gray-900 min-w-[4rem] text-center">{{ cantidad }}</span>
                    <button @click="cantidad = Math.min(producto.stock, cantidad + 1)"
                      class="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <button @click="agregarAlCarrito"
                    class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary-600/30">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Agregar al Carrito
                  </button>
                </div>
              </div>

              <button @click="contactarWhatsapp"
                :disabled="producto.stock === 0"
                :class="producto.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:transform hover:-translate-y-0.5'"
                class="w-full text-white rounded-xl px-6 py-5 text-lg font-bold shadow-lg shadow-gray-900/20 transition-all duration-200 flex items-center justify-center gap-3">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Contactar por WhatsApp
              </button>

              <p class="text-center text-gray-500 text-sm mt-4">
                Respuesta rápida • Envío disponible a Canarias
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos relacionados o botón volver -->
      <div class="mt-12 text-center">
        <NuxtLink to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all border border-gray-200">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ver más productos
        </NuxtLink>
      </div>
    </div>

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
import type { Producto } from '~/stores/products'

const route = useRoute()
const productId = Number(route.params.id)

// Stores
const productsStore = useProductsStore()
const cartStore = useCartStore()
const { $toast } = useNuxtApp()
const toast = $toast

// State
const cantidad = ref(1)
const mostrarCarrito = ref(false)
const pending = ref(false)
const error = ref<string | null>(null)

// Producto desde el store
const producto = computed(() => productsStore.getProductoById(productId))

// Inicializar datos
onMounted(async () => {
  cartStore.initCart()

  // Si el producto no está en el store, cargarlo
  if (!producto.value) {
    try {
      pending.value = true
      await productsStore.fetchProducto(productId)
    } catch (err: any) {
      error.value = err.message || 'Error al cargar producto'
    } finally {
      pending.value = false
    }
  }
})

// Computed desde stores
const cart = computed(() => cartStore.items)
const cartCount = computed(() => cartStore.cartCount)
const cartTotal = computed(() => cartStore.cartTotal)

// Formato de precio
const formatPrecio = (precio: any) => {
  if (!precio) return '0.00'
  const precioNum = typeof precio === 'string' ? parseFloat(precio) : Number(precio)
  if (isNaN(precioNum)) return '0.00'
  return precioNum.toFixed(2)
}

// Contactar por WhatsApp
const contactarWhatsapp = () => {
  if (!producto.value) return

  const telefono = '34614244514'
  const mensaje = `Hola, estoy interesado en el producto: ${producto.value.titulo} (€${formatPrecio(producto.value.precio)})`
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`

  window.open(url, '_blank')
}

// Funciones del carrito
const agregarAlCarrito = () => {
  if (!producto.value || !producto.value.stock || producto.value.stock === 0) return

  const cantidadAgregada = cantidad.value

  cartStore.addToCart({
    id: producto.value.id,
    titulo: producto.value.titulo,
    precio: producto.value.precio,
    imagen: producto.value.imagen,
    stock: producto.value.stock,
    descuento: producto.value.descuento,
    precio_original: producto.value.precio_original
  }, cantidadAgregada)

  // Reset cantidad después de agregar
  cantidad.value = 1

  toast.success(`${cantidadAgregada} ${cantidadAgregada === 1 ? 'unidad' : 'unidades'} de "${producto.value.titulo}" ${cantidadAgregada === 1 ? 'agregada' : 'agregadas'} al carrito`)
}

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

// SEO
useHead({
  title: computed(() => producto.value ? `${producto.value.titulo} - GRORSHOP` : 'Producto - GRORSHOP'),
  meta: [
    {
      name: 'description',
      content: computed(() => producto.value?.descripcion || 'Producto disponible en GRORSHOP')
    }
  ]
})
</script>
