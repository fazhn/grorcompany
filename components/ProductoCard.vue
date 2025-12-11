<template>
  <div
    class="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
    <!-- Imagen del producto -->
    <div class="relative bg-gray-50 aspect-square overflow-hidden cursor-pointer" @click="emit('ver', producto)">
      <img v-if="producto.imagen" :src="producto.imagen" :alt="producto.titulo"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
      <div v-else class="flex items-center justify-center h-full">
        <svg class="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Quick Action Overlay - Hidden on touch, visible on hover for desktop -->
      <div
        class="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center bg-gradient-to-t from-black/50 to-transparent pointer-events-none md:pointer-events-auto">
        <button @click.stop="emit('ver', producto)"
          class="bg-white text-gray-900 px-6 py-2.5 rounded-full font-medium text-sm shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all pointer-events-auto">
          Vista Rápida
        </button>
      </div>
    </div>

    <!-- Información del producto -->
    <div class="p-3 md:p-5">
      <div class="mb-2">
        <p class="text-[10px] md:text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1 line-clamp-1">
          {{ producto.categoria || 'Novedad' }}
        </p>
        <h3
          class="text-gray-900 font-bold text-sm md:text-lg leading-tight group-hover:text-primary-600 transition-colors line-clamp-2 cursor-pointer"
          @click="emit('ver', producto)">
          {{ producto.titulo }}
        </h3>
      </div>

      <div class="flex items-start justify-between gap-2 md:gap-4 mt-2 md:mt-4">
        <span class="text-lg md:text-xl font-bold text-gray-900">€{{ formatPrecio(producto.precio) }}</span>

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

const props = defineProps<{
  producto: Producto
}>()

const emit = defineEmits(['ver'])

const formatPrecio = (precio: any) => {
  if (!precio) return '0.00'
  const precioNum = typeof precio === 'string' ? parseFloat(precio) : Number(precio)
  if (isNaN(precioNum)) return '0.00'
  return precioNum.toFixed(2)
}
</script>
