import pool from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { enabled } = body

    if (typeof enabled !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'El valor de enabled debe ser booleano'
      })
    }

    await pool.query(
      'UPDATE site_settings SET setting_value = ? WHERE setting_key = ?',
      [enabled ? 'true' : 'false', 'maintenance_mode']
    )

    console.log(`✓ Modo mantenimiento ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`)

    return {
      success: true,
      maintenanceMode: enabled
    }
  } catch (error: any) {
    console.error('Error al actualizar modo mantenimiento:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Error al actualizar modo mantenimiento'
    })
  }
})
