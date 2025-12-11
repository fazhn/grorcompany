<template>
  <div class="relative overflow-hidden bg-white">
    <!-- Background Decoration -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-100/50 to-primary-50/30 blur-3xl opacity-70">
      </div>
      <div
        class="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-100/40 to-pink-50/30 blur-3xl opacity-70">
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
          Descubre tu estilo <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">
            único y auténtico
          </span>
        </h1>

        <p class="mt-4 text-xl text-gray-600 md:text-2xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Explora nuestra colección selecta de productos diseñados para destacar. Calidad premium, diseños exclusivos y
          la mejor experiencia de compra.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button @click="scrollToCatalog"
            class="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 ring-4 ring-gray-900/10">
            Ver Colección
          </button>
          <button
            class="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 ring-4 ring-transparent hover:ring-gray-100">
            Más Información
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollToCatalog = () => {
  const catalog = document.getElementById('catalogo')
  if (catalog) {
    catalog.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
