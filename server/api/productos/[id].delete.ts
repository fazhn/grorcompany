import pool from '~/server/utils/db'
import { deleteFile } from '~/server/utils/minio'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de producto requerido'
      })
    }

    // Obtener producto para acceder a la URL de la imagen
    const [rows]: any = await pool.query('SELECT * FROM productos WHERE id = ?', [id])

    if (!rows || rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
      })
    }

    const producto = rows[0]

    // Intentar eliminar la imagen de MinIO si existe
    if (producto.imagen) {
      try {
        console.log(`📸 URL de imagen a eliminar: ${producto.imagen}`)

        // Extraer el nombre del archivo de la URL
        // Formato típico: https://servidor/bucket/productos/timestamp-nombre.webp
        const urlParts = producto.imagen.split('/')
        console.log(`📋 URL dividida en partes:`, urlParts)

        const fileName = urlParts.slice(-2).join('/') // "productos/timestamp-nombre.webp"
        console.log(`🗑️  Nombre de archivo extraído para eliminar: ${fileName}`)

        await deleteFile(fileName)
        console.log(`✓ Imagen eliminada exitosamente de MinIO`)
      } catch (imageError: any) {
        console.error('❌ ERROR al eliminar imagen de MinIO:')
        console.error('   Mensaje:', imageError.message)
        console.error('   Stack:', imageError.stack)
        console.error('   Error completo:', imageError)
        // Continuar con la eliminación del producto aunque falle la imagen
      }
    } else {
      console.log(`ℹ️  El producto no tiene imagen asociada`)
    }

    // Eliminar el producto de la base de datos
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
