# Instrucciones de Uso - Catálogo de Productos

## 1. Configurar la Base de Datos

Primero, necesitas crear la tabla en tu base de datos MariaDB. Conéctate a tu base de datos y ejecuta el script SQL:

```bash
mysql -h 217.154.184.200 -P 3308 -u mariadb -p grorcompany < server/database/schema.sql
```

O copia el contenido de `server/database/schema.sql` y ejecútalo en tu cliente de base de datos.

## 2. Iniciar el Servidor de Desarrollo

El servidor ya está corriendo en:
- **URL**: http://localhost:3007

Si necesitas iniciarlo nuevamente:
```bash
npm run dev -- --host localhost --port 3007
```

## 3. Acceder a la Aplicación

### Catálogo Público
- **URL**: http://localhost:3007/
- Aquí los clientes pueden ver todos los productos disponibles
- No requiere autenticación

### Panel de Administración
- **URL**: http://localhost:3007/admin
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 4. Agregar Productos

Una vez autenticado en el panel de administración:

1. **Título**: Nombre del producto (requerido)
2. **Descripción**: Descripción detallada del producto
3. **Imagen**: Sube una imagen desde tu computadora
   - Las imágenes se guardan en `public/images/productos/`
4. **Variantes de Colores**: Agrega los colores disponibles
   - Escribe el color y haz clic en "Agregar Color"
   - Puedes agregar múltiples colores
5. **Precio**: Precio del producto (requerido)

Haz clic en "Guardar Producto" para agregar el producto al catálogo.

## 5. Estructura del Proyecto

```
├── server/
│   ├── api/
│   │   ├── productos/
│   │   │   ├── index.get.ts    # Obtener todos los productos
│   │   │   └── index.post.ts   # Crear nuevo producto
│   │   └── upload.post.ts      # Subir imágenes
│   ├── database/
│   │   └── schema.sql          # Script SQL para crear tabla
│   └── utils/
│       └── db.ts               # Configuración de conexión DB
├── pages/
│   ├── index.vue               # Catálogo público
│   └── admin.vue               # Panel de administración
├── components/
│   └── ProductoCard.vue        # Componente de tarjeta de producto
└── public/
    └── images/
        └── productos/          # Imágenes de productos
```

## 6. Características

### Catálogo Público
- ✅ Vista de grid responsive
- ✅ Tarjetas de producto con imagen, título, descripción
- ✅ Visualización de colores disponibles
- ✅ Precio destacado
- ✅ Diseño mobile-friendly

### Panel de Administración
- ✅ Autenticación con credenciales hardcoded
- ✅ Formulario completo para agregar productos
- ✅ Upload de imágenes con preview
- ✅ Gestión de variantes de colores
- ✅ Validación de campos requeridos
- ✅ Mensajes de éxito/error

## 7. API Endpoints

### GET /api/productos
Obtiene todos los productos ordenados por fecha de creación (más recientes primero)

**Respuesta:**
```json
[
  {
    "id": 1,
    "titulo": "Producto 1",
    "descripcion": "Descripción del producto",
    "imagen": "/images/productos/1234567890-imagen.jpg",
    "colores": ["Rojo", "Azul", "Verde"],
    "precio": 99.99,
    "created_at": "2024-01-01 12:00:00",
    "updated_at": "2024-01-01 12:00:00"
  }
]
```

### POST /api/productos
Crea un nuevo producto

**Body:**
```json
{
  "titulo": "Nuevo Producto",
  "descripcion": "Descripción detallada",
  "imagen": "/images/productos/imagen.jpg",
  "colores": ["Rojo", "Azul"],
  "precio": 149.99
}
```

### POST /api/upload
Sube una imagen para un producto

**Form Data:**
- `file`: Archivo de imagen (multipart/form-data)

**Respuesta:**
```json
{
  "success": true,
  "filename": "/images/productos/1234567890-imagen.jpg"
}
```

## 8. Notas Importantes

- Las credenciales de administración están hardcoded en `pages/admin.vue`
- La conexión a la base de datos está configurada en `server/utils/db.ts`
- Las imágenes se almacenan localmente en `public/images/productos/`
- La autenticación se mantiene en localStorage del navegador
- Los colores se almacenan como JSON en la base de datos

## 9. Solución de Problemas

### Error de conexión a la base de datos
Si ves errores de timeout al conectarse a la base de datos:
1. Verifica que el servidor MariaDB esté accesible en `217.154.184.200:3308`
2. Confirma que las credenciales sean correctas
3. Asegúrate de que la tabla `productos` exista (ejecuta el script SQL)

### Las páginas no se muestran
Si ves la pantalla de bienvenida de Nuxt en lugar del catálogo:
1. Verifica que `app.vue` contenga `<NuxtPage />` en lugar de `<NuxtWelcome />`
2. Reinicia el servidor de desarrollo
