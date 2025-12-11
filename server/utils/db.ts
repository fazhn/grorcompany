import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: '207.180.197.240',
  port: 3308,
  user: 'mariadb',
  password: 'Litio+1994',
  database: 'catalogo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 segundos de timeout
})

// Función para probar la conexión
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('✅ Conexión a base de datos exitosa')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error)
    return false
  }
}

export default pool
