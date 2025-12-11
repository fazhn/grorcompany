import sharp from 'sharp'
import { uploadFile } from '~/server/utils/minio'

// Configuración de tamaños de imagen
const IMAGE_CONFIG = {
  width: 800,
  height: 800,
  quality: 85,
  format: 'webp' as const
}

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

    // Procesar imagen con Sharp
    console.log(`📸 Procesando imagen: ${file.filename}`)
    const processedImage = await sharp(file.data)
      .resize(IMAGE_CONFIG.width, IMAGE_CONFIG.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: IMAGE_CONFIG.quality })
      .toBuffer()

    console.log(`✓ Imagen procesada - Tamaño original: ${file.data.length} bytes, Nuevo: ${processedImage.length} bytes`)

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const sanitizedName = file.filename
      .replace(/\.[^/.]+$/, '') // Remover extensión
      .replace(/[^a-zA-Z0-9]/g, '-') // Reemplazar caracteres especiales
      .toLowerCase()
    const filename = `productos/${timestamp}-${sanitizedName}.webp`

    // Subir a MinIO
    const url = await uploadFile(filename, processedImage, 'image/webp')

    return {
      success: true,
      filename: url
    }
  } catch (error: any) {
    console.error('Error al subir archivo:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al subir archivo: ' + (error.message || 'Error desconocido')
    })
  }
})
