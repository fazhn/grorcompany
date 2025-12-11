import pool from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto requerido'
      })
    }

    // Verificar si el producto existe
    const [rows]: any = await pool.query('SELECT * FROM productos WHERE id = ?', [id])

    if (!rows || rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
      })
    }

    // Eliminar el producto
    await pool.query('DELETE FROM productos WHERE id = ?', [id])

    return {
      success: true,
      message: 'Producto eliminado exitosamente'
    }
  } catch (error: any) {
    console.error('Error al eliminar producto:', error)

    // Si el error ya tiene statusCode (errores de validación), lanzarlo directamente
    if (error.statusCode) {
      throw error
    }

    // Detectar si es un error de conexión
    const isConnectionError = error.code === 'ETIMEDOUT' ||
                              error.code === 'ECONNREFUSED' ||
                              error.code === 'ENOTFOUND'

    throw createError({
      statusCode: 500,
      message: isConnectionError
        ? 'No se puede conectar a la base de datos. Verifica que el servidor esté accesible.'
        : 'Error al eliminar producto: ' + (error.message || 'Error desconocido')
    })
  }
})
