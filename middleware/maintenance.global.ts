export default defineNuxtRouteMiddleware(async (to, from) => {
  // Solo ejecutar en el cliente
  if (process.server) return

  // Rutas que siempre deben ser accesibles
  const allowedRoutes = ['/mantenimiento', '/admin']

  // Si ya estamos en una ruta permitida, no hacer nada
  if (allowedRoutes.some(route => to.path.startsWith(route))) {
    return
  }

  try {
    // Verificar estado de mantenimiento
    const { maintenanceMode } = await $fetch<{ maintenanceMode: boolean }>('/api/settings/maintenance')

    // Si el modo mantenimiento está activo, redirigir
    if (maintenanceMode && to.path !== '/mantenimiento') {
      return navigateTo('/mantenimiento')
    }

    // Si el modo mantenimiento está desactivado y estamos en la página de mantenimiento, redirigir al inicio
    if (!maintenanceMode && to.path === '/mantenimiento') {
      return navigateTo('/')
    }
  } catch (error) {
    console.error('Error al verificar modo mantenimiento:', error)
    // En caso de error, permitir continuar
  }
})
