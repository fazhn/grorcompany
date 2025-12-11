import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_SERVER_URL?.replace('https://', '').replace('http://', '') || '',
  port: 443,
  useSSL: true,
  accessKey: process.env.MINIO_ROOT_USER || '',
  secretKey: process.env.MINIO_ROOT_PASSWORD || ''
})

export const bucketName = process.env.MINIO_BUCKET || 'grorshop'

// Función para asegurar que el bucket existe
export async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(bucketName)
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1')
      console.log(`✓ Bucket "${bucketName}" creado exitosamente`)
    }

    // SIEMPRE configurar política pública para el bucket (incluso si ya existe)
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`]
        }
      ]
    }

    try {
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy))
      console.log(`✓ Política pública configurada para bucket "${bucketName}"`)
    } catch (policyError) {
      console.error('Error al configurar política del bucket:', policyError)
    }

  } catch (error) {
    console.error('Error al verificar/crear bucket:', error)
    throw error
  }
}

// Función para subir un archivo
export async function uploadFile(
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  try {
    await ensureBucketExists()

    const metadata = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000'
    }

    await minioClient.putObject(bucketName, fileName, fileBuffer, fileBuffer.length, metadata)
    console.log(`✓ Archivo subido exitosamente: ${fileName}`)

    // Generar URL pública del archivo
    // Usar URL directa sin protocolo específico para mejor compatibilidad
    const url = `${process.env.MINIO_SERVER_URL}/${bucketName}/${fileName}`
    console.log(`✓ URL generada: ${url}`)

    // Verificar que el archivo existe
    try {
      const stat = await minioClient.statObject(bucketName, fileName)
      console.log(`✓ Archivo verificado - Tamaño: ${stat.size} bytes`)
    } catch (statError) {
      console.error('⚠️  Advertencia: No se pudo verificar el archivo:', statError)
    }

    return url
  } catch (error) {
    console.error('Error al subir archivo a MinIO:', error)
    throw error
  }
}

// Función para eliminar un archivo
export async function deleteFile(fileName: string): Promise<void> {
  try {
    await minioClient.removeObject(bucketName, fileName)
    console.log(`✓ Archivo "${fileName}" eliminado de MinIO`)
  } catch (error) {
    console.error('Error al eliminar archivo de MinIO:', error)
    throw error
  }
}

export default minioClient
