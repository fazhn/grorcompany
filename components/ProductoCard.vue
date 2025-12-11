<template>
  <div class="group">
    <!-- Imagen del producto -->
    <div class="relative mb-3 rounded-lg overflow-hidden bg-white/60 w-48 h-36 mx-auto ring-1 ring-gray-400/30 transition-all duration-300 group-hover:ring-orange-500/50 group-hover:shadow-lg group-hover:shadow-orange-500/10">
      <img
        v-if="producto.imagen"
        :src="producto.imagen"
        :alt="producto.titulo"
        class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="flex items-center justify-center h-full">
        <svg class="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <!-- Overlay en hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <!-- Información del producto -->
    <div class="space-y-3">
      <!-- Título y categoría -->
      <div>
        <h3 class="text-gray-900 font-semibold text-lg mb-1.5 tracking-tight transition-colors duration-300 group-hover:text-orange-600">{{ producto.titulo }}</h3>
        <p class="text-gray-600 text-sm">{{ producto.descripcion || 'Producto' }}</p>
      </div>

      <!-- Precio -->
      <div class="flex items-center gap-3 pt-2">
        <span class="text-red-600 font-bold text-2xl tracking-tight">€{{ formatPrecio(producto.precio) }}</span>
      </div>

      <!-- Badges de variantes -->
      <div v-if="producto.colores && producto.colores.length > 0" class="flex flex-wrap gap-2 pt-2">
        <span
          v-for="(color, index) in producto.colores"
          :key="index"
          class="px-2.5 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-lg shadow-sm transition-all duration-300 hover:bg-yellow-300 hover:shadow-md"
        >
          {{ color }}
        </span>
      </div>

      <!-- Botón Ver -->
      <div class="pt-3">
        <button
          @click="emit('ver')"
          class="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
        >
          Ver Detalles
        </button>
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

const emit = defineEmits<{
  ver: []
}>()

const formatPrecio = (precio: any) => {
  if (!precio) return '0.00'
  const precioNum = typeof precio === 'string' ? parseFloat(precio) : Number(precio)
  if (isNaN(precioNum)) return '0.00'
  return precioNum.toFixed(2)
}
</script>
