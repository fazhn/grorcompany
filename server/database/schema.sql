-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  imagen VARCHAR(500),
  colores JSON,
  precio DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ejemplo de datos
-- INSERT INTO productos (titulo, descripcion, imagen, colores, precio) VALUES
-- ('Producto 1', 'Descripción del producto 1', '/images/producto1.jpg', '["Rojo", "Azul", "Verde"]', 99.99);
