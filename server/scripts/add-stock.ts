import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env') })

import pool from '../utils/db'

async function addStock() {
  try {
    console.log('🚀 Agregando columna para stock...')

    // Agregar columna stock
    await pool.query(`
      ALTER TABLE productos
      ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0
    `)

    console.log('✓ Columna agregada:')
    console.log('  - stock (INT) - cantidad disponible')

    console.log('\n✅ Actualización completada exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

addStock()
