-- Tabla para configuraciones del sitio
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_setting_key (setting_key)
);

-- Insertar configuración inicial de mantenimiento
INSERT INTO site_settings (setting_key, setting_value)
VALUES ('maintenance_mode', 'false')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
