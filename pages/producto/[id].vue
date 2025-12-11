<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between gap-8">
          <!-- Logo y botón volver -->
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="flex items-center gap-3 cursor-pointer group">
              <div class="w-10 h-10 rounded-xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105">
                <img src="/images/logo.jpeg" alt="GRORSHOP Logo" class="w-full h-full object-cover" />
              </div>
              <h1 class="text-xl font-bold text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">
                GRORSHOP
              </h1>
            </NuxtLink>
          </div>

          <NuxtLink to="/" class="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all duration-300 border border-gray-200 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Catálogo
          </NuxtLink>
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
      <NuxtLink to="/" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all">
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
          <div class="relative bg-gray-50 flex items-center justify-center p-8 md:p-12 min-h-[400px] md:min-h-[600px]">
            <img v-if="producto.imagen" :src="producto.imagen" :alt="producto.titulo"
              class="max-w-full max-h-full object-contain filter drop-shadow-2xl" />
            <div v-else class="flex items-center justify-center">
              <svg class="w-32 h-32 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Información del producto -->
          <div class="p-8 md:p-12 flex flex-col">
            <div class="mb-auto">
              <!-- Categoría -->
              <div class="flex items-center gap-2 mb-6">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
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
                  <span class="text-gray-500 text-sm block mb-1">Precio</span>
                  <span class="text-5xl font-extrabold text-gray-900">€{{ formatPrecio(producto.precio) }}</span>
                </div>
              </div>

              <button @click="contactarWhatsapp"
                class="w-full bg-gray-900 text-white rounded-xl px-6 py-5 text-lg font-bold shadow-lg shadow-gray-900/20 hover:bg-black hover:transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
        <NuxtLink to="/" class="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all border border-gray-200">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ver más productos
        </NuxtLink>
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

const route = useRoute()
const productId = route.params.id

// Fetch producto
const { data: producto, pending, error } = await useFetch<Producto>(`/api/productos/${productId}`, {
  transform: (data: any) => {
    if (data) {
      return {
        ...data,
        colores: typeof data.colores === 'string' ? JSON.parse(data.colores) : data.colores
      }
    }
    return null
  }
})

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

// SEO
useHead({
  title: producto.value ? `${producto.value.titulo} - GRORSHOP` : 'Producto - GRORSHOP',
  meta: [
    {
      name: 'description',
      content: producto.value?.descripcion || 'Producto disponible en GRORSHOP'
    }
  ]
})
</script>
