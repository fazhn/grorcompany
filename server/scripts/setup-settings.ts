import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env') })

import pool from '../utils/db'

async function setupSettings() {
  try {
    console.log('🚀 Creando tabla de configuración...')

    // Crear tabla
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_setting_key (setting_key)
      )
    `)
    console.log('✓ Tabla site_settings creada')

    // Insertar configuración inicial
    await pool.query(`
      INSERT INTO site_settings (setting_key, setting_value)
      VALUES ('maintenance_mode', 'false')
      ON DUPLICATE KEY UPDATE setting_key = setting_key
    `)
    console.log('✓ Configuración inicial insertada')

    console.log('\n✅ Setup completado exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

setupSettings()
