import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  titulo: string
  precio: number
  imagen: string
  cantidad: number
  stock: number
  descuento?: number
  precio_original?: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

  getters: {
    // Cantidad total de items en el carrito
    cartCount: (state) => {
      return state.items.reduce((count, item) => count + item.cantidad, 0)
    },

    // Total del carrito
    cartTotal: (state) => {
      return state.items.reduce((total, item) => {
        return total + (Number(item.precio) * item.cantidad)
      }, 0)
    },

    // Verificar si un producto está en el carrito
    isInCart: (state) => {
      return (productId: number) => state.items.some(item => item.id === productId)
    },

    // Obtener cantidad de un producto en el carrito
    getItemQuantity: (state) => {
      return (productId: number) => {
        const item = state.items.find(item => item.id === productId)
        return item ? item.cantidad : 0
      }
    }
  },

  actions: {
    // Inicializar carrito desde localStorage
    initCart() {
      if (process.client) {
        const saved = localStorage.getItem('grorshop-cart')
        if (saved) {
          this.items = JSON.parse(saved)
        }
      }
    },

    // Guardar en localStorage
    saveCart() {
      if (process.client) {
        localStorage.setItem('grorshop-cart', JSON.stringify(this.items))
      }
    },

    // Agregar producto al carrito
    addToCart(product: Omit<CartItem, 'cantidad'>, cantidad: number = 1) {
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        // Si ya existe, aumentar cantidad (respetando el stock)
        const newCantidad = Math.min(existingItem.cantidad + cantidad, product.stock)
        existingItem.cantidad = newCantidad
      } else {
        // Si no existe, agregarlo
        this.items.push({
          ...product,
          cantidad: Math.min(cantidad, product.stock)
        })
      }

      this.saveCart()
    },

    // Actualizar cantidad de un item
    updateQuantity(productId: number, cantidad: number) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.cantidad = Math.max(1, Math.min(cantidad, item.stock))
        this.saveCart()
      }
    },

    // Remover item del carrito
    removeFromCart(productId: number) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
        this.saveCart()
      }
    },

    // Vaciar carrito
    clearCart() {
      this.items = []
      this.saveCart()
    },

    // Generar mensaje de WhatsApp
    generateWhatsAppMessage() {
      let mensaje = '🛒 *Pedido desde GRORSHOP*\n\n'

      this.items.forEach((item, index) => {
        const precio = Number(item.precio)
        mensaje += `${index + 1}. *${item.titulo}*\n`
        mensaje += `   Cantidad: ${item.cantidad}\n`
        mensaje += `   Precio unitario: €${precio.toFixed(2)}\n`
        mensaje += `   Subtotal: €${(precio * item.cantidad).toFixed(2)}\n\n`
      })

      mensaje += `💰 *Total: €${this.cartTotal.toFixed(2)}*`

      return mensaje
    }
  }
})
