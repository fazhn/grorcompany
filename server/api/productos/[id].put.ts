import pool from '~/server/utils/db'
import { deleteFile } from '~/server/utils/minio'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto requerido'
      })
    }

    // Verificar que el producto existe
    const [rows]: any = await pool.query('SELECT * FROM productos WHERE id = ?', [id])

    if (!rows || rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
      })
    }

    const productoActual = rows[0]

    // Validaciones
    if (!body.titulo || !body.categoria) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Título y categoría son requeridos'
      })
    }

    // Si se está actualizando la imagen y es diferente a la actual, eliminar la anterior
    if (body.imagen && body.imagen !== productoActual.imagen && productoActual.imagen) {
      try {
        const urlParts = productoActual.imagen.split('/')
        const fileName = urlParts.slice(-2).join('/')
        console.log(`🗑️  Eliminando imagen anterior de MinIO: ${fileName}`)
        await deleteFile(fileName)
        console.log(`✓ Imagen anterior eliminada`)
      } catch (imageError) {
        console.error('⚠️  Advertencia: No se pudo eliminar la imagen anterior:', imageError)
      }
    }

    // Preparar datos para actualizar
    const coloresJSON = JSON.stringify(body.colores || [])

    // Actualizar producto
    await pool.query(
      `UPDATE productos
       SET titulo = ?, descripcion = ?, categoria = ?, imagen = ?, colores = ?, precio = ?, es_nuevo = ?, descuento = ?, precio_original = ?
       WHERE id = ?`,
      [
        body.titulo,
        body.descripcion || '',
        body.categoria,
        body.imagen || productoActual.imagen, // Mantener imagen actual si no se proporciona nueva
        coloresJSON,
        body.precio || 0,
        body.es_nuevo || false,
        body.descuento || 0,
        body.precio_original || null,
        id
      ]
    )

    console.log(`✓ Producto actualizado - ID: ${id}`)

    return {
      success: true,
      message: 'Producto actualizado exitosamente'
    }
  } catch (error: any) {
    console.error('Error al actualizar producto:', error)

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
        : 'Error al actualizar producto: ' + (error.message || 'Error desconocido')
    })
  }
})
