import pool from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos ORDER BY created_at DESC')
    return rows
  } catch (error: any) {
    console.error('Error al obtener productos:', error)

    // Detectar si es un error de conexión
    const isConnectionError = error.code === 'ETIMEDOUT' ||
                              error.code === 'ECONNREFUSED' ||
                              error.code === 'ENOTFOUND'

    if (isConnectionError) {
      // Retornar array vacío en lugar de error para no romper la UI
      console.warn('⚠️  Base de datos no disponible, retornando lista vacía')
      return []
    }

    throw createError({
      statusCode: 500,
      message: 'Error al obtener productos: ' + (error.message || 'Error desconocido')
    })
  }
})
