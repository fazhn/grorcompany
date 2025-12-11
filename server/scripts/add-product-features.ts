import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env') })

import pool from '../utils/db'

async function addProductFeatures() {
  try {
    console.log('🚀 Agregando columnas para descuento y producto nuevo...')

    // Agregar columnas
    await pool.query(`
      ALTER TABLE productos
      ADD COLUMN IF NOT EXISTS es_nuevo BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS descuento DECIMAL(5,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS precio_original DECIMAL(10,2) DEFAULT NULL
    `)

    console.log('✓ Columnas agregadas:')
    console.log('  - es_nuevo (BOOLEAN)')
    console.log('  - descuento (DECIMAL)')
    console.log('  - precio_original (DECIMAL)')

    console.log('\n✅ Actualización completada exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

addProductFeatures()
