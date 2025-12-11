import { defineStore } from 'pinia'

export interface Producto {
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

export const useProductsStore = defineStore('products', {
  state: () => ({
    productos: [] as Producto[],
    loading: false,
    error: null as string | null,
    categoriaSeleccionada: 'Todos'
  }),

  getters: {
    // Obtener productos filtrados por categoría
    productosFiltrados: (state) => {
      if (state.categoriaSeleccionada === 'Todos') {
        return state.productos
      }
      return state.productos.filter(p => p.categoria === state.categoriaSeleccionada)
    },

    // Obtener categorías únicas
    categorias: (state) => {
      const cats = state.productos.map(p => p.categoria)
      return ['Todos', ...Array.from(new Set(cats))]
    },

    // Obtener producto por ID
    getProductoById: (state) => {
      return (id: number) => state.productos.find(p => p.id === id)
    },

    // Productos nuevos
    productosNuevos: (state) => {
      return state.productos.filter(p => p.es_nuevo)
    },

    // Productos en descuento
    productosEnDescuento: (state) => {
      return state.productos.filter(p => p.descuento && p.descuento > 0)
    }
  },

  actions: {
    // Cargar todos los productos
    async fetchProductos() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<Producto[]>('/api/productos')

        // Procesar datos de la DB
        this.productos = response.map(producto => ({
          ...producto,
          colores: typeof producto.colores === 'string'
            ? JSON.parse(producto.colores)
            : producto.colores,
          es_nuevo: producto.es_nuevo === 1 || producto.es_nuevo === true,
          descuento: producto.descuento ? Number(producto.descuento) : 0,
          precio_original: producto.precio_original ? Number(producto.precio_original) : null,
          stock: producto.stock ? Number(producto.stock) : 0,
          precio: Number(producto.precio)
        }))
      } catch (err: any) {
        this.error = err.message || 'Error al cargar productos'
        console.error('Error fetching productos:', err)
      } finally {
        this.loading = false
      }
    },

    // Cargar un producto específico por ID
    async fetchProducto(id: number) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<Producto>(`/api/productos/${id}`)

        // Procesar datos de la DB
        const producto = {
          ...response,
          colores: typeof response.colores === 'string'
            ? JSON.parse(response.colores)
            : response.colores,
          es_nuevo: response.es_nuevo === 1 || response.es_nuevo === true,
          descuento: response.descuento ? Number(response.descuento) : 0,
          precio_original: response.precio_original ? Number(response.precio_original) : null,
          stock: response.stock ? Number(response.stock) : 0,
          precio: Number(response.precio)
        }

        // Actualizar o agregar el producto en el estado
        const index = this.productos.findIndex(p => p.id === id)
        if (index !== -1) {
          this.productos[index] = producto
        } else {
          this.productos.push(producto)
        }

        return producto
      } catch (err: any) {
        this.error = err.message || 'Error al cargar producto'
        console.error('Error fetching producto:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Crear producto (admin)
    async createProducto(productoData: Partial<Producto>) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{ id: number }>('/api/productos', {
          method: 'POST',
          body: productoData
        })

        // Recargar productos para obtener el nuevo
        await this.fetchProductos()

        return response.id
      } catch (err: any) {
        this.error = err.message || 'Error al crear producto'
        console.error('Error creating producto:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Actualizar producto (admin)
    async updateProducto(id: number, productoData: Partial<Producto>) {
      this.loading = true
      this.error = null

      try {
        await $fetch(`/api/productos/${id}`, {
          method: 'PUT',
          body: productoData
        })

        // Recargar productos para obtener los datos actualizados
        await this.fetchProductos()
      } catch (err: any) {
        this.error = err.message || 'Error al actualizar producto'
        console.error('Error updating producto:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Eliminar producto (admin)
    async deleteProducto(id: number) {
      this.loading = true
      this.error = null

      try {
        await $fetch(`/api/productos/${id}`, {
          method: 'DELETE'
        })

        // Eliminar del estado local
        this.productos = this.productos.filter(p => p.id !== id)
      } catch (err: any) {
        this.error = err.message || 'Error al eliminar producto'
        console.error('Error deleting producto:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Cambiar categoría seleccionada
    setCategoriaSeleccionada(categoria: string) {
      this.categoriaSeleccionada = categoria
    }
  }
})
