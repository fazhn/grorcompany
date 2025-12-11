import pool from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { titulo, descripcion, categoria, imagen, colores, precio, es_nuevo, descuento, precio_original, stock } = body

    // Validación básica
    if (!titulo || !precio) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Título y precio son requeridos'
      })
    }

    const coloresJson = JSON.stringify(colores || [])

    const [result] = await pool.query(
      'INSERT INTO productos (titulo, descripcion, categoria, imagen, colores, precio, es_nuevo, descuento, precio_original, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [titulo, descripcion, categoria, imagen, coloresJson, precio, es_nuevo || false, descuento || 0, precio_original || null, stock || 0]
    )

    return {
      success: true,
      id: (result as any).insertId,
      message: 'Producto creado exitosamente'
    }
  } catch (error: any) {
    console.error('Error al crear producto:', error)

    // Si el error es por validación, lanzarlo directamente
    if (error.statusCode === 400) {
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
        : 'Error al crear producto: ' + (error.message || 'Error desconocido')
    })
  }
})
