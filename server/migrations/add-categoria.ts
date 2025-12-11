import pool from '../utils/db'

async function addCategoriaColumn() {
  try {
    // Agregar la columna categoria si no existe
    await pool.query(`
      ALTER TABLE productos
      ADD COLUMN IF NOT EXISTS categoria VARCHAR(100) AFTER descripcion
    `)

    console.log('✓ Columna "categoria" agregada exitosamente')
    process.exit(0)
  } catch (error: any) {
    // Si el error es porque la columna ya existe, está bien
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✓ La columna "categoria" ya existe')
      process.exit(0)
    }
    console.error('Error al agregar la columna:', error)
    process.exit(1)
  }
}

addCategoriaColumn()
