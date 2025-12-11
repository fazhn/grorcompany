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

    const [rows]: any = await pool.query('SELECT * FROM productos WHERE id = ?', [id])

    if (!rows || rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
      })
    }

    return rows[0]
  } catch (error: any) {
    console.error('Error al obtener producto:', error)

    if (error.statusCode) {
      throw error
    }

    const isConnectionError = error.code === 'ETIMEDOUT' ||
                              error.code === 'ECONNREFUSED' ||
                              error.code === 'ENOTFOUND'

    throw createError({
      statusCode: 500,
      message: isConnectionError
        ? 'No se puede conectar a la base de datos'
        : 'Error al obtener producto: ' + (error.message || 'Error desconocido')
    })
  }
})
