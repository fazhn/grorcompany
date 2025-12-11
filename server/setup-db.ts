/**
 * Script para crear la tabla de productos en la base de datos
 * Ejecutar con: npx tsx server/setup-db.ts
 */

import pool from './utils/db'
import { readFileSync } from 'fs'
import { join } from 'path'

async function setup() {
  try {
    console.log('📦 Creando tabla de productos...')

    const sql = `
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        imagen VARCHAR(500),
        colores JSON,
        precio DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `

    await pool.query(sql)
    console.log('✅ Tabla "productos" creada exitosamente')

    // Verificar
    const [tables] = await pool.query("SHOW TABLES LIKE 'productos'")
    if ((tables as any[]).length > 0) {
      console.log('✅ Verificación: Tabla existe')

      // Mostrar estructura
      const [columns] = await pool.query('DESCRIBE productos')
      console.log('\n📋 Estructura de la tabla:')
      console.table(columns)
    }

  } catch (error) {
    console.error('❌ Error al crear tabla:', error)
  } finally {
    await pool.end()
  }
}

setup()
