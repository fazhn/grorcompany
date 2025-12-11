import pool from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT setting_value FROM site_settings WHERE setting_key = ?',
      ['maintenance_mode']
    )

    const isMaintenanceMode = rows[0]?.setting_value === 'true'

    return {
      maintenanceMode: isMaintenanceMode
    }
  } catch (error) {
    console.error('Error al obtener estado de mantenimiento:', error)
    return {
      maintenanceMode: false
    }
  }
})
