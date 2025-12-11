import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)

    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No se recibió ningún archivo'
      })
    }

    const file = form[0]

    if (!file.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nombre de archivo inválido'
      })
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.filename}`
    const filepath = join(process.cwd(), 'public', 'images', 'productos', filename)

    // Guardar el archivo
    await writeFile(filepath, file.data)

    return {
      success: true,
      filename: `/images/productos/${filename}`
    }
  } catch (error) {
    console.error('Error al subir archivo:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al subir archivo'
    })
  }
})
