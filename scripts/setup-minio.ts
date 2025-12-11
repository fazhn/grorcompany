import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: 'principal-minio.6ofkuu.easypanel.host',
  port: 443,
  useSSL: true,
  accessKey: 'admin',
  secretKey: '21de9Kc3y'
})

const bucketName = 'grorshop'

async function setupBucket() {
  try {
    console.log('🔍 Verificando conexión con MinIO...')

    // Verificar si el bucket existe
    const exists = await minioClient.bucketExists(bucketName)
    console.log(`📦 Bucket "${bucketName}" ${exists ? 'ya existe' : 'no existe'}`)

    if (!exists) {
      console.log(`📦 Creando bucket "${bucketName}"...`)
      await minioClient.makeBucket(bucketName, 'us-east-1')
      console.log(`✅ Bucket "${bucketName}" creado exitosamente`)
    }

    // Configurar política pública
    console.log('🔧 Configurando política pública del bucket...')
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

    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy))
    console.log('✅ Política pública configurada correctamente')

    // Configurar CORS
    console.log('🔧 Configurando CORS del bucket...')
    const corsConfig = {
      CORSRules: [
        {
          AllowedOrigins: ['*'],
          AllowedMethods: ['GET', 'HEAD'],
          AllowedHeaders: ['*'],
          MaxAgeSeconds: 3000
        }
      ]
    }

    try {
      // MinIO usa la API de S3 para CORS
      const command = `mc anonymous set-json ${bucketName} <<EOF
${JSON.stringify(corsConfig, null, 2)}
EOF`
      console.log('⚠️  Nota: CORS debe configurarse desde la consola de MinIO o usando mc (MinIO Client)')
      console.log('   Ejecuta: mc cors set --cors-config cors.json minio/${bucketName}')
    } catch (corsError: any) {
      console.log('⚠️  No se pudo configurar CORS automáticamente:', corsError.message)
    }

    // Verificar la política
    console.log('🔍 Verificando política del bucket...')
    const currentPolicy = await minioClient.getBucketPolicy(bucketName)
    console.log('📋 Política actual:', JSON.parse(currentPolicy))

    console.log('\n✅ ¡Configuración completada exitosamente!')
    console.log(`\n📝 El bucket "${bucketName}" está listo para usar`)
    console.log(`🌐 Los archivos serán accesibles públicamente en:`)
    console.log(`   https://principal-minio.6ofkuu.easypanel.host/${bucketName}/`)

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error('Detalles:', error)
    process.exit(1)
  }
}

setupBucket()
