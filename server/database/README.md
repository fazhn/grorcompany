# Configuración de Base de Datos

## Paso 1: Ejecutar el script SQL

Conecta a tu base de datos MariaDB y ejecuta el archivo `schema.sql`:

```bash
mysql -h 217.154.184.200 -P 3308 -u mariadb -p grorcompany < server/database/schema.sql
```

O desde un cliente de base de datos, ejecuta el contenido de `schema.sql`.

## Paso 2: Verificar la tabla

```sql
USE grorcompany;
SHOW TABLES;
DESCRIBE productos;
```

## Estructura de la tabla

La tabla `productos` contiene los siguientes campos:
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `titulo`: VARCHAR(255) NOT NULL
- `descripcion`: TEXT
- `imagen`: VARCHAR(500) - Ruta de la imagen en el servidor
- `colores`: JSON - Array de colores disponibles
- `precio`: DECIMAL(10, 2) NOT NULL
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Conexión

La aplicación se conecta automáticamente usando la configuración en `server/utils/db.ts`:
- Host: 217.154.184.200
- Puerto: 3308
- Usuario: mariadb
- Base de datos: grorcompany
