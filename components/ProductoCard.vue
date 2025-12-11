<template>
  <NuxtLink :to="`/producto/${producto.id}`"
    class="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 block">
    <div class="relative bg-white aspect-[4/5] overflow-hidden flex items-center justify-center p-2">
      <img v-if="producto.imagen" :src="producto.imagen" :alt="producto.titulo"
        class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" loading="lazy" />
      <div v-else class="flex items-center justify-center w-full h-full bg-gray-50">
        <svg class="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Badge NUEVO (izquierda) -->
      <span v-if="producto.es_nuevo"
        class="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold shadow-sm border border-gray-100 flex items-center gap-1.5 ring-1 ring-black/5 uppercase tracking-wider">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        NUEVO
      </span>

      <!-- Badge DESCUENTO (derecha) -->
      <span v-if="producto.descuento && producto.descuento > 0"
        class="absolute top-3 right-3 z-10 bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold shadow-lg shadow-rose-600/30 border border-rose-500/20 flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        -{{ producto.descuento }}%
      </span>

      <!-- Quick Action Overlay -->
      <div
        class="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 bg-gradient-to-t from-black/70 to-transparent">
        <button @click.prevent="agregarAlCarrito"
          :disabled="!producto.stock || producto.stock === 0"
          class="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {{ producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito' }}
        </button>
        <span class="bg-white text-gray-900 px-4 py-2 rounded-xl font-medium text-sm shadow-lg text-center">
          Ver Detalles
        </span>
      </div>
    </div>

    <!-- Información del producto -->
    <div class="p-3 md:p-5">
      <div class="mb-2">
        <p class="text-[10px] md:text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1 line-clamp-1">
          {{ producto.categoria || 'Novedad' }}
        </p>
        <h3
          class="text-gray-900 font-bold text-sm md:text-lg leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
          {{ producto.titulo }}
        </h3>
      </div>

      <div class="flex items-start justify-between gap-2 md:gap-4 mt-2 md:mt-4">
        <div class="flex flex-col">
          <div v-if="producto.descuento && producto.descuento > 0" class="flex items-center gap-2">
            <span class="text-lg md:text-xl font-bold text-red-600">€{{ formatPrecio(producto.precio) }}</span>
            <span class="text-xs md:text-sm text-gray-400 line-through">€{{ formatPrecio(producto.precio_original)
              }}</span>
          </div>
          <span v-else class="text-lg md:text-xl font-bold text-gray-900">€{{ formatPrecio(producto.precio) }}</span>

          <!-- Stock status -->
          <div class="mt-1.5">
            <span v-if="producto.stock === 0"
              class="text-[10px] md:text-xs text-red-600 font-semibold flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
              </svg>
              Agotado
            </span>
            <span v-else-if="producto.stock && producto.stock < 5"
              class="text-[10px] md:text-xs text-orange-600 font-semibold flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
              Pocas unidades
            </span>
            <span v-else-if="producto.stock && producto.stock > 0"
              class="text-[10px] md:text-xs text-green-600 font-semibold flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
              Disponible
            </span>
          </div>
        </div>

        <div v-if="producto.colores && producto.colores.length > 0"
          class="flex items-center -space-x-1.5 md:-space-x-2">
          <div v-for="(color, index) in producto.colores.slice(0, 3)" :key="index"
            class="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-gray-600 uppercase"
            :title="color">
            {{ color.charAt(0) }}
          </div>
          <div v-if="producto.colores.length > 3"
            class="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] md:text-[9px] text-gray-500">
            +{{ producto.colores.length - 3 }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

interface Producto {
  id: number
  titulo: string
  descripcion: string
  categoria: string
  imagen: string
  colores: string[]
  precio: number
  es_nuevo?: boolean
  descuento?: number
  precio_original?: number
  stock?: number
}

const props = defineProps<{
  producto: Producto
}>()

const { $toast } = useNuxtApp()
const toast = $toast

const formatPrecio = (precio: any) => {
  if (!precio) return '0.00'
  const precioNum = typeof precio === 'string' ? parseFloat(precio) : Number(precio)
  if (isNaN(precioNum)) return '0.00'
  return precioNum.toFixed(2)
}

// Cart functionality
const cartStore = useCartStore()

const agregarAlCarrito = () => {
  if (!props.producto.stock || props.producto.stock === 0) return

  cartStore.addToCart({
    id: props.producto.id,
    titulo: props.producto.titulo,
    precio: props.producto.precio,
    imagen: props.producto.imagen,
    stock: props.producto.stock || 0,
    descuento: props.producto.descuento,
    precio_original: props.producto.precio_original
  }, 1)

  toast.success(`"${props.producto.titulo}" agregado al carrito`)
}
</script>
