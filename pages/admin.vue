<template>
  <div class="min-h-screen bg-[#fcf3e2]">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white/60 border border-gray-400/50 p-10 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl">
        <div class="text-center mb-10">
          <div class="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <img src="/images/logo.jpeg" alt="GRORSHOP Logo" class="w-full h-full object-cover" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Panel de Administración</h1>
          <p class="text-gray-700 text-sm">GRORSHOP Admin</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2.5">Usuario</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              required
              placeholder="admin"
              class="w-full px-4 py-3.5 bg-white/80 border border-gray-400/50 text-gray-900 placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all duration-300 backdrop-blur-sm"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2.5">Contraseña</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3.5 bg-white/80 border border-gray-400/50 text-gray-900 placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all duration-300 backdrop-blur-sm"
            />
          </div>

          <button type="submit" class="w-full px-4 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] mt-6">
            Iniciar Sesión
          </button>

          <p v-if="loginError" class="text-red-700 text-center text-sm mt-4 bg-red-500/20 px-4 py-2.5 rounded-lg border border-red-500/30">{{ loginError }}</p>
        </form>
      </div>
    </div>

    <!-- Admin Panel -->
    <div v-else>
      <!-- Header -->
      <header class="border-b border-gray-700/30 backdrop-blur-xl bg-[#fcf3e2]/80 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl overflow-hidden shadow-lg">
                <img src="/images/logo.jpeg" alt="GRORSHOP Logo" class="w-full h-full object-cover" />
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900 tracking-tight">Panel de Administración</h1>
                <p class="text-sm text-gray-700">Gestiona tu catálogo</p>
              </div>
            </div>

            <div class="flex gap-3">
              <NuxtLink to="/" class="px-5 py-2.5 bg-white/60 hover:bg-white/80 text-gray-900 rounded-xl transition-all duration-300 backdrop-blur-sm border border-gray-400/50 hover:border-gray-500">
                Ver Catálogo
              </NuxtLink>
              <button @click="handleLogout" class="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/40">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-gray-800/20 border border-gray-700/50 rounded-3xl p-10 backdrop-blur-sm shadow-2xl">
          <h2 class="text-3xl font-bold text-white mb-8 tracking-tight">Agregar Nuevo Producto</h2>

          <form @submit.prevent="handleSubmit" class="space-y-7">
            <!-- Título -->
            <div>
              <label for="titulo" class="block text-sm font-medium text-gray-300 mb-2.5">Título del Producto *</label>
              <input
                id="titulo"
                v-model="form.titulo"
                type="text"
                required
                placeholder="Ej: Mochila Infantil Stitch"
                class="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <!-- Descripción -->
            <div>
              <label for="descripcion" class="block text-sm font-medium text-gray-300 mb-2.5">Descripción</label>
              <textarea
                id="descripcion"
                v-model="form.descripcion"
                rows="3"
                placeholder="Ej: Disney, Escolar, Viaje..."
                class="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none resize-none transition-all duration-300 backdrop-blur-sm"
              ></textarea>
            </div>

            <!-- Categoría -->
            <div>
              <label for="categoria" class="block text-sm font-medium text-gray-300 mb-2.5">Categoría *</label>
              <select
                id="categoria"
                v-model="form.categoria"
                required
                class="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700/50 text-white rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                <option value="" disabled>Selecciona una categoría</option>
                <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <!-- Imagen -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2.5">Imagen del Producto</label>
              <div class="flex gap-4">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  class="flex-1 text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer file:transition-all file:duration-300 file:shadow-lg file:shadow-orange-500/20 hover:file:shadow-orange-500/40"
                />
              </div>
              <div v-if="imagePreview" class="mt-5">
                <img :src="imagePreview" alt="Preview" class="w-48 h-48 object-cover rounded-2xl border border-gray-700/50 shadow-xl ring-1 ring-gray-800/50" />
              </div>
            </div>

            <!-- Colores/Variantes -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2.5">Variantes / Badges</label>
              <div class="flex gap-3">
                <input
                  v-model="colorInput"
                  type="text"
                  placeholder="Ej: Disney, Premium, Nuevo..."
                  @keypress.enter.prevent="agregarColor"
                  class="flex-1 px-4 py-3.5 bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all duration-300 backdrop-blur-sm"
                />
                <button type="button" @click="agregarColor" class="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:scale-105">
                  Agregar
                </button>
              </div>
              <div v-if="form.colores.length > 0" class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="(color, index) in form.colores"
                  :key="index"
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-gray-900 rounded-lg text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-yellow-300"
                >
                  {{ color }}
                  <button type="button" @click="eliminarColor(index)" class="hover:text-red-600 font-bold transition-colors">×</button>
                </span>
              </div>
            </div>

            <!-- Precio -->
            <div>
              <label for="precio" class="block text-sm font-medium text-gray-300 mb-2.5">Precio (€) *</label>
              <input
                id="precio"
                v-model.number="form.precio"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="29.90"
                class="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <!-- Botones -->
            <div class="flex gap-4 pt-6">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02]"
              >
                {{ isSubmitting ? 'Guardando...' : 'Guardar Producto' }}
              </button>
              <button
                type="button"
                @click="resetForm"
                class="px-6 py-3.5 bg-gray-700/50 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500"
              >
                Limpiar
              </button>
            </div>

            <!-- Mensaje de estado -->
            <p
              v-if="submitMessage"
              :class="[
                'px-5 py-3.5 rounded-xl font-medium text-center transition-all duration-300',
                submitStatus === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10' : 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10'
              ]"
            >
              {{ submitMessage }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
}

const isAuthenticated = ref(false)
const loginForm = ref({ username: '', password: '' })
const loginError = ref('')

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
    let imagePath = ''
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('file', selectedFile.value)
      const uploadResponse = await $fetch<{ filename: string }>('/api/upload', {
        method: 'POST',
        body: formData
      })
      imagePath = uploadResponse.filename
    }

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
    resetForm()

    setTimeout(() => {
      submitMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error al crear producto:', error)
    submitMessage.value = '✗ Error al crear el producto'
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
}

onMounted(() => {
  if (process.client) {
    const auth = localStorage.getItem('admin_auth')
    if (auth === 'true') {
      isAuthenticated.value = true
    }
  }
})

watch(isAuthenticated, (newVal) => {
  if (process.client) {
    if (newVal) {
      localStorage.setItem('admin_auth', 'true')
    } else {
      localStorage.removeItem('admin_auth')
    }
  }
})
</script>
