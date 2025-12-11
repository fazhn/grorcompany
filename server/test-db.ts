/**
 * Script para probar la conexión a la base de datos
 * Ejecutar con: npx tsx server/test-db.ts
 */

import pool, { testConnection } from './utils/db'

async function main() {
  console.log('🔍 Probando conexión a la base de datos...')
  console.log('Host: 207.180.197.240:3308')
  console.log('Database: catalogo')
  console.log('---')

  const isConnected = await testConnection()

  if (isConnected) {
    console.log('✅ Conexión exitosa!')

    try {
      // Verificar si la tabla existe
      const [tables] = await pool.query("SHOW TABLES LIKE 'productos'")
      if ((tables as any[]).length > 0) {
        console.log('✅ Tabla "productos" existe')

        // Contar productos
        const [count] = await pool.query('SELECT COUNT(*) as total FROM productos')
        console.log(`📊 Productos en la base de datos: ${(count as any[])[0].total}`)
      } else {
        console.log('⚠️  La tabla "productos" no existe')
        console.log('   Ejecuta el script SQL en server/database/schema.sql')
      }
    } catch (error) {
      console.error('❌ Error al verificar tabla:', error)
    }
  } else {
    console.log('❌ No se pudo conectar a la base de datos')
    console.log('\nPosibles soluciones:')
    console.log('1. Verifica que el servidor MariaDB esté corriendo')
    console.log('2. Verifica que el firewall permita conexiones al puerto 3308')
    console.log('3. Verifica que las credenciales sean correctas')
    console.log('4. Verifica que tu IP tenga acceso al servidor remoto')
  }

  await pool.end()
  process.exit(isConnected ? 0 : 1)
}

main()
